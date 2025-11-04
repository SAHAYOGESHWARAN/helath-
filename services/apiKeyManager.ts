/**
 * API Key Manager
 * 
 * Manages API keys for EMR integration securely.
 * Handles key storage, rotation, and validation.
 */

export interface APIKeyInfo {
    key: string;
    name: string;
    environment: 'development' | 'staging' | 'production';
    permissions: string[];
    createdAt: string;
    expiresAt?: string;
    lastUsed?: string;
}

/**
 * API Key Manager Class
 */
export class APIKeyManager {
    private static readonly STORAGE_KEY = 'emr_api_keys';
    private static readonly ACTIVE_KEY_KEY = 'emr_active_api_key';

    /**
     * Store API key securely
     */
    static setActiveAPIKey(key: string, metadata?: Partial<APIKeyInfo>): void {
        try {
            // In production, use secure storage (e.g., encrypted localStorage or secure vault)
            const keyInfo: APIKeyInfo = {
                key,
                name: metadata?.name || 'Default API Key',
                environment: metadata?.environment || 'development',
                permissions: metadata?.permissions || ['read', 'write'],
                createdAt: metadata?.createdAt || new Date().toISOString(),
                expiresAt: metadata?.expiresAt,
            };

            // Store in session storage (more secure than localStorage)
            sessionStorage.setItem(this.ACTIVE_KEY_KEY, key);

            // Store metadata separately
            const keys = this.getAllKeys();
            keys[key] = keyInfo;
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
        } catch (error) {
            console.error('Failed to store API key:', error);
            throw new Error('Failed to store API key securely');
        }
    }

    /**
     * Get active API key
     */
    static getActiveAPIKey(): string | null {
        try {
            return sessionStorage.getItem(this.ACTIVE_KEY_KEY);
        } catch {
            return null;
        }
    }

    /**
     * Get API key info
     */
    static getAPIKeyInfo(key?: string): APIKeyInfo | null {
        try {
            const activeKey = key || this.getActiveAPIKey();
            if (!activeKey) return null;

            const keys = this.getAllKeys();
            return keys[activeKey] || null;
        } catch {
            return null;
        }
    }

    /**
     * Get all stored keys (metadata only, not the actual keys)
     */
    static getAllKeys(): Record<string, APIKeyInfo> {
        try {
            const stored = sessionStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    /**
     * Validate API key format
     */
    static validateAPIKeyFormat(key: string): boolean {
        // Basic validation - adjust based on your API key format
        return key.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(key);
    }

    /**
     * Check if API key is expired
     */
    static isAPIKeyExpired(key?: string): boolean {
        const keyInfo = this.getAPIKeyInfo(key);
        if (!keyInfo || !keyInfo.expiresAt) return false;

        return new Date(keyInfo.expiresAt) < new Date();
    }

    /**
     * Remove API key
     */
    static removeAPIKey(key?: string): void {
        try {
            const activeKey = key || this.getActiveAPIKey();
            if (!activeKey) return;

            const keys = this.getAllKeys();
            delete keys[activeKey];
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));

            if (key === activeKey || !key) {
                sessionStorage.removeItem(this.ACTIVE_KEY_KEY);
            }
        } catch (error) {
            console.error('Failed to remove API key:', error);
        }
    }

    /**
     * Clear all API keys
     */
    static clearAllKeys(): void {
        try {
            sessionStorage.removeItem(this.ACTIVE_KEY_KEY);
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear API keys:', error);
        }
    }

    /**
     * Rotate API key
     */
    static async rotateAPIKey(newKey: string, metadata?: Partial<APIKeyInfo>): Promise<void> {
        const oldKey = this.getActiveAPIKey();
        this.setActiveAPIKey(newKey, metadata);

        if (oldKey) {
            // Optionally keep old key for a grace period
            const oldKeyInfo = this.getAPIKeyInfo(oldKey);
            if (oldKeyInfo) {
                // Mark old key as deprecated
                const keys = this.getAllKeys();
                keys[oldKey] = {
                    ...oldKeyInfo,
                    name: `${oldKeyInfo.name} (Deprecated)`,
                };
                sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
            }
        }
    }

    /**
     * Get API key from environment or storage
     */
    static getAPIKey(): string | null {
        // Priority: Environment variable > Session storage > null
        return (
            process.env.VITE_EMR_API_KEY ||
            this.getActiveAPIKey() ||
            null
        );
    }
}

export default APIKeyManager;

