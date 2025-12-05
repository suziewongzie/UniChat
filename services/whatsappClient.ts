import { WhatsAppCredentials, WhatsAppPayload } from '../types';

/**
 * WhatsApp Cloud API Wrapper
 * 
 * This class acts as a client SDK for the WhatsApp Business Cloud API.
 * Documentation: https://developers.facebook.com/docs/whatsapp/cloud-api
 */
export class WhatsAppClient {
  private baseUrl = "https://graph.facebook.com/v18.0";
  private credentials: WhatsAppCredentials | null = null;

  constructor() {
    // Try to load from storage on initialization
    this.loadCredentials();
  }

  /**
   * Configure the client with API credentials
   */
  configure(creds: WhatsAppCredentials) {
    this.credentials = creds;
    this.saveCredentials(creds);
  }

  /**
   * Check if the client is configured and ready to use real API
   */
  isConfigured(): boolean {
    return !!(this.credentials?.phoneNumberId && this.credentials?.accessToken);
  }

  /**
   * Send a text message
   */
  async sendText(to: string, text: string, replyToMessageId?: string): Promise<any> {
    const payload: WhatsAppPayload = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(to),
      type: "text",
      text: { body: text, preview_url: true }
    };

    if (replyToMessageId) {
      payload.context = { message_id: replyToMessageId };
    }

    return this.sendRequest(payload);
  }

  /**
   * Send a media message (Image, Video, Document)
   */
  async sendMedia(to: string, type: 'image' | 'video' | 'document' | 'audio', url: string, caption?: string): Promise<any> {
    const payload: WhatsAppPayload = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(to),
      type: type,
      [type]: {
        link: url,
        caption: caption
      }
    };
    return this.sendRequest(payload);
  }

  /**
   * Send a template message (Required for initiating conversations)
   */
  async sendTemplate(to: string, templateName: string, languageCode: string = 'en_US'): Promise<any> {
    const payload: WhatsAppPayload = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode }
      }
    };
    return this.sendRequest(payload);
  }

  // ==========================================
  // Private Helpers
  // ==========================================

  private async sendRequest(payload: WhatsAppPayload): Promise<any> {
    if (!this.isConfigured()) {
      console.warn("WhatsApp Client not configured. Request mocked.");
      return { success: true, mocked: true };
    }

    const url = `${this.baseUrl}/${this.credentials!.phoneNumberId}/messages`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'WhatsApp API Error');
      }

      return data;
    } catch (error) {
      console.error("WhatsApp API Request Failed:", error);
      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Basic sanitization to remove +, spaces, dashes
    return phone.replace(/[^0-9]/g, '');
  }

  private saveCredentials(creds: WhatsAppCredentials) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wa_creds', JSON.stringify(creds));
    }
  }

  private loadCredentials() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wa_creds');
      if (stored) {
        try {
          this.credentials = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse WhatsApp credentials");
        }
      }
    }
  }
}

// Export singleton instance
export const whatsappClient = new WhatsAppClient();
