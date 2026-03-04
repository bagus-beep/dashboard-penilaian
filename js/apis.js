/**
 * ========================================
 * API - HTTP Client with Security & Rate Limiting
 * ========================================
 */

import { CONFIG } from './config.js';

// Export API object
export const API = {
  token: null,
  lastRequestTime: 0,
  minRequestInterval: 1000, // Minimum 1 second between requests
  requestQueue: [],
  isProcessing: false,
  
  /**
   * Get or create persistent device ID
   */
  getDeviceId() {
    const STORAGE_KEY = "device_id";
    let id = localStorage.getItem(STORAGE_KEY);
    
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  },
  
  /**
   * Encode buffer to base64 URL-safe string
   */
  _base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
  
  /**
   * Create SHA-256 hash as base64 URL
   */
  async _sha256Base64Url(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return this._base64UrlEncode(hash);
  },
  
  /**
   * Build security parameters for API calls
   */
  async _buildSecurityParams() {
    const ts = Date.now().toString();
    const deviceId = this.getDeviceId();
    const raw = ts + deviceId + CONFIG.ORIGIN_KEY;
    const signature = await this._sha256Base64Url(raw);
    
    return { ts, device_id: deviceId, origin_key: CONFIG.ORIGIN_KEY, signature };
  },
  
  /**
   * Fetch authentication token
   */
  async _fetchToken() {
    const security = await this._buildSecurityParams();
    const params = new URLSearchParams({ mode: "auth", ...security });
    
    const res = await fetch(CONFIG.API_URL + "?" + params);
    const json = await res.json();
    
    if (!json.success) {
      throw new Error(json.error || "Auth failed");
    }
    
    this.token = json.token;
  },
  
  /**
   * Process queued requests with rate limiting
   */
  async _processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      
      // Rate limiting - wait if needed
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.minRequestInterval) {
        await this._delay(this.minRequestInterval - timeSinceLastRequest);
      }
      
      this.lastRequestTime = Date.now();
      
      try {
        const result = await this._doFetch(request.mode, request.params, request.retries);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
    
    this.isProcessing = false;
  },
  
  /**
   * Generic fetch with rate limiting and retry logic
   */
  async fetch(mode, params, retries) {
    if (!retries) retries = 2;
    
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ mode, params, retries, resolve, reject });
      this._processQueue();
    });
  },
  
  /**
   * Actual fetch implementation
   */
  async _doFetch(mode, params, retries) {
    // Ensure we have a token
    if (!this.token) {
      await this._fetchToken();
    }
    
    const security = await this._buildSecurityParams();
    const queryParams = new URLSearchParams({
      token: this.token,
      mode,
      ...security,
      ...params
    });
    
    try {
      const res = await fetch(CONFIG.API_URL + "?" + queryParams);
      const json = await res.json();
      
      if (!json.success) {
        // Token expired - refresh and retry
        const errorLower = (json.error || '').toLowerCase();
        if (errorLower.includes("expired") || errorLower.includes("unauthorized")) {
          if (retries > 0) {
            await this._fetchToken();
            return this._doFetch(mode, params, retries - 1);
          }
        }
        
        // Rate limit error
        if (errorLower.includes("rate limit") || errorLower.includes("too many request")) {
          // Wait longer before retry
          await this._delay(3000);
          if (retries > 0) {
            return this._doFetch(mode, params, retries - 1);
          }
        }
        
        throw new Error(json.error);
      }
      
      return json.data;
      
    } catch (error) {
      // Network error - retry
      if (retries > 0 && (error.name === "TypeError" || error.message.includes("network"))) {
        await this._delay(1000);
        return this._doFetch(mode, params, retries - 1);
      }
      throw error;
    }
  },
  
  /**
   * Delay helper
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Backward compatibility alias - export as default and window
export const apiFetch = function(mode, params) {
  return API.fetch(mode, params);
};

// Make available globally for backward compatibility
window.API = API;
window.apiFetch = apiFetch;
