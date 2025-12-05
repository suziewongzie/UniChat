import { FacebookCredentials, Contact, Message, Platform, MetaConversation, MetaMessage } from '../types';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

/**
 * Facebook/Instagram Graph API Wrapper
 * Handles SDK initialization, Login, Page Subscription, and Data Fetching.
 */
export class FacebookClient {
  private credentials: FacebookCredentials | null = null;
  private isSdkLoaded = false;

  constructor() {
    this.loadCredentials();
  }

  configure(creds: FacebookCredentials) {
    this.credentials = { ...this.credentials, ...creds };
    this.saveCredentials();
    if (creds.appId && !this.isSdkLoaded) {
      this.initSdk(creds.appId);
    }
  }

  isConfigured(): boolean {
    return !!(this.credentials?.appId && this.credentials?.userAccessToken);
  }

  getCredentials() {
    return this.credentials;
  }

  /**
   * Inject Facebook SDK script
   */
  private initSdk(appId: string) {
    if (window.FB) {
        this.isSdkLoaded = true;
        window.FB.init({
            appId: appId,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
        return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      this.isSdkLoaded = true;
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s) as HTMLScriptElement; js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode?.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  /**
   * Trigger Facebook Login Popup
   */
  login(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.credentials?.appId) {
        return reject("App ID not configured");
      }

      if (!window.FB) {
        console.warn("Facebook SDK not loaded. Simulating login for demo.");
        this.credentials!.userAccessToken = "mock_fb_token_" + Date.now();
        this.saveCredentials();
        resolve();
        return;
      }

      window.FB.login((response: any) => {
        if (response.authResponse) {
          this.credentials!.userAccessToken = response.authResponse.accessToken;
          this.saveCredentials();
          this.fetchPages(); 
          resolve();
        } else {
          reject("User cancelled login or did not fully authorize.");
        }
      }, { 
        scope: 'pages_show_list,pages_messaging,pages_manage_metadata,instagram_basic,instagram_manage_messages' 
      });
    });
  }

  /**
   * Fetch Pages the user manages and try to find linked Instagram accounts
   */
  async fetchPages() {
    if (!this.credentials?.userAccessToken) return;

    if (this.credentials.userAccessToken.startsWith('mock_')) {
        console.log("Simulating Page Fetch...");
        return;
    }

    window.FB.api('/me/accounts', (response: any) => {
        if (response && !response.data) {
           console.error("Failed to fetch pages", response);
           return;
        }

        if (response.data.length > 0) {
            const page = response.data[0];
            this.credentials!.pageId = page.id;
            this.subscribeAppToPage(page.id, page.access_token);
            this.getInstagramAccount(page.id, page.access_token);
            this.saveCredentials();
        }
    });
  }

  private subscribeAppToPage(pageId: string, pageAccessToken: string) {
    window.FB.api(
        `/${pageId}/subscribed_apps`,
        'post',
        { access_token: pageAccessToken, subscribed_fields: ['messages', 'messaging_postbacks'] },
        (response: any) => {
            console.log('Subscribed to Page Webhooks:', response);
        }
    );
  }

  private getInstagramAccount(pageId: string, pageAccessToken: string) {
      window.FB.api(
          `/${pageId}`,
          { fields: 'instagram_business_account', access_token: pageAccessToken },
          (response: any) => {
              if (response.instagram_business_account) {
                  this.credentials!.instagramId = response.instagram_business_account.id;
                  this.saveCredentials();
                  console.log("Linked Instagram Account Found:", response.instagram_business_account.id);
              }
          }
      );
  }

  // =========================================================================
  // DATA FETCHING (Conversations & Messages)
  // =========================================================================

  async getConversations(platform: 'messenger' | 'instagram'): Promise<Contact[]> {
      if (!this.credentials?.userAccessToken || this.credentials.userAccessToken.startsWith('mock_')) {
          // Return empty or throw if mocked, as we rely on PlatformService mock fallback usually
          throw new Error("Cannot fetch real conversations without valid token");
      }

      return new Promise((resolve, reject) => {
          let path = '';
          if (platform === 'messenger') {
             if (!this.credentials?.pageId) return reject("No Page ID found. Please log in again.");
             path = `/${this.credentials.pageId}/conversations?fields=participants,updated_time,unread_count,snippet&platform=messenger`;
          } else {
             if (!this.credentials?.instagramId) return reject("No Instagram Business Account linked to this Page.");
             path = `/${this.credentials.instagramId}/conversations?fields=participants,updated_time,unread_count,last_message`;
          }

          window.FB.api(path, (response: any) => {
              if (!response || response.error) {
                  return reject(response?.error?.message || "Failed to fetch conversations");
              }

              const conversations: MetaConversation[] = response.data;
              const contacts: Contact[] = conversations.map(conv => {
                  // For Messenger, participants includes the Page itself, so we filter it out if we know the Page ID
                  // For simplicity, we just take the first participant that isn't us ideally
                  const participant = conv.participants?.data[0] || { name: 'Unknown', id: '0' };
                  
                  return {
                      id: conv.id,
                      name: participant.name,
                      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random`,
                      platform: platform,
                      lastMessage: conv.snippet || (conv as any).last_message || 'Attachment',
                      lastMessageTime: new Date(conv.updated_time),
                      unreadCount: conv.unread_count || 0,
                      isOnline: false 
                  };
              });
              resolve(contacts);
          });
      });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
     if (!this.credentials?.userAccessToken) return [];

     return new Promise((resolve, reject) => {
        window.FB.api(`/${conversationId}/messages?fields=message,created_time,from,attachments`, (response: any) => {
            if (!response || response.error) {
                return reject(response?.error?.message || "Failed to fetch messages");
            }

            const metaMessages: MetaMessage[] = response.data;
            const messages: Message[] = metaMessages.map(m => {
                let type: any = 'text';
                let mediaUrl = undefined;
                let fileName = undefined;

                if (m.attachments && m.attachments.data.length > 0) {
                    const att = m.attachments.data[0];
                    if (att.image_data) {
                        type = 'image';
                        mediaUrl = att.image_data.url;
                    } else if (att.video_data) {
                        type = 'video';
                        mediaUrl = att.video_data.url;
                    } else if (att.file_url) {
                         type = 'document';
                         mediaUrl = att.file_url;
                         fileName = att.name;
                    }
                }

                // Determine sender. If 'from.id' matches our Page ID/IG ID, it's 'me'
                // We need to store our own ID somewhere better, but for now we assume the credentials have it
                const isMe = m.from.id === this.credentials?.pageId || m.from.id === this.credentials?.instagramId;

                return {
                    id: m.id,
                    text: m.message || '',
                    sender: isMe ? 'me' : 'other',
                    timestamp: new Date(m.created_time),
                    status: 'read', // Graph API doesn't give read receipts easily per message
                    type,
                    mediaUrl,
                    fileName
                };
            });
            
            // Sort by time ascending
            resolve(messages.reverse());
        });
     });
  }

  private saveCredentials() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fb_creds', JSON.stringify(this.credentials));
    }
  }

  private loadCredentials() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fb_creds');
      if (stored) {
        try {
          this.credentials = JSON.parse(stored);
          if (this.credentials?.appId) {
             this.initSdk(this.credentials.appId);
          }
        } catch (e) {
          console.error("Failed to parse FB credentials");
        }
      }
    }
  }
}

export const facebookClient = new FacebookClient();
