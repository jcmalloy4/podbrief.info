/**
 * PodBrief App Redirect Utility
 * Handles smart redirection to the PodBrief app with proper fallbacks
 */

class PodBriefRedirect {
    constructor() {
        this.appScheme = 'podbrief://';
        this.iosPackage = 'com.PodBrief';
        this.androidPackage = 'com.PodBrief';
        this.appStoreURL = 'https://apps.apple.com/app/podbrief/id6748547717';
        this.playStoreURL = 'https://play.google.com/store/apps/details?id=com.PodBrief';
    }

    // Detect user's platform
    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/iphone|ipad|ipod/.test(userAgent)) {
            return 'ios';
        } else if (/android/.test(userAgent)) {
            return 'android';
        } else if (/macintosh|mac os x/.test(userAgent)) {
            return 'macos';
        } else if (/windows/.test(userAgent)) {
            return 'windows';
        } else {
            return 'unknown';
        }
    }

    // Generate app URLs for different platforms
    generateAppURL(path, platform = null) {
        const detectedPlatform = platform || this.detectPlatform();
        
        switch (detectedPlatform) {
            case 'ios':
                return {
                    universal: `https://podbrief.info${path}`,
                    scheme: `${this.appScheme}${path.replace('/', '')}`,
                    store: this.appStoreURL
                };
            
            case 'android':
                return {
                    intent: `intent://${path.replace('/', '')}#Intent;scheme=podbrief;package=${this.androidPackage};end`,
                    scheme: `${this.appScheme}${path.replace('/', '')}`,
                    store: this.playStoreURL
                };
            
            default:
                return {
                    universal: `https://podbrief.info${path}`,
                    store: null
                };
        }
    }

    // Attempt to redirect to app
    async redirectToApp(path, options = {}) {
        const platform = this.detectPlatform();
        const urls = this.generateAppURL(path, platform);
        const config = {
            timeout: 3000,
            showFallback: true,
            onSuccess: null,
            onFallback: null,
            ...options
        };

        // Track redirect attempt
        console.log(`Attempting app redirect for path: ${path} on platform: ${platform}`);

        if (platform === 'ios') {
            return this.redirectIOS(urls, config);
        } else if (platform === 'android') {
            return this.redirectAndroid(urls, config);
        } else {
            return this.showDesktopFallback(urls, config);
        }
    }

    // iOS-specific redirect logic
    async redirectIOS(urls, config) {
        try {
            // Try universal link first
            window.location.href = urls.universal;
            
            // Fallback to custom scheme after delay
            setTimeout(() => {
                window.location.href = urls.scheme;
            }, 1000);

            // Show fallback options after timeout
            setTimeout(() => {
                if (config.showFallback) {
                    this.showMobileFallback('ios', urls, config);
                }
                if (config.onFallback) {
                    config.onFallback('ios', urls);
                }
            }, config.timeout);

        } catch (error) {
            console.error('iOS redirect failed:', error);
            this.showMobileFallback('ios', urls, config);
        }
    }

    // Android-specific redirect logic
    async redirectAndroid(urls, config) {
        try {
            // Use Android intent URL
            window.location.href = urls.intent;

            // Show fallback options after timeout
            setTimeout(() => {
                if (config.showFallback) {
                    this.showMobileFallback('android', urls, config);
                }
                if (config.onFallback) {
                    config.onFallback('android', urls);
                }
            }, config.timeout);

        } catch (error) {
            console.error('Android redirect failed:', error);
            this.showMobileFallback('android', urls, config);
        }
    }

    // Show mobile fallback options
    showMobileFallback(platform, urls, config) {
        const fallbackHTML = `
            <div class="app-redirect-fallback" style="
                position: fixed; 
                bottom: 0; 
                left: 0; 
                right: 0; 
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a); 
                padding: 1.5rem; 
                border-radius: 16px 16px 0 0; 
                box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                z-index: 1000;
                text-align: center;
                color: white;
            ">
                <h3 style="margin: 0 0 1rem; font-size: 1.1rem;">Trouble opening PodBrief?</h3>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.location.href='${urls.scheme}'" style="
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Try Again</button>
                    <a href="${urls.store}" style="
                        background: #333;
                        color: white;
                        text-decoration: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                    ">${platform === 'ios' ? '📱 Download for iOS' : '🤖 Get on Play Store'}</a>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: transparent;
                        color: #888;
                        border: 1px solid #555;
                        padding: 0.75rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                    ">✕</button>
                </div>
            </div>
        `;

        // Remove existing fallback if present
        const existing = document.querySelector('.app-redirect-fallback');
        if (existing) existing.remove();

        // Add new fallback
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
    }

    // Show desktop fallback
    showDesktopFallback(urls, config) {
        const fallbackHTML = `
            <div class="desktop-redirect-message" style="
                max-width: 600px;
                margin: 2rem auto;
                padding: 2rem;
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                border: 1px solid rgba(255,255,255,0.1);
                text-align: center;
            ">
                <h2>PodBrief is mobile-first</h2>
                <p>Get the PodBrief app on your mobile device to access episode briefings and enjoy the full experience.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                    <a href="${this.appStoreURL}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.75rem 1.5rem;
                        background: #1a1a1a;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                    ">📱 iOS App</a>
                    <a href="${this.playStoreURL}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.75rem 1.5rem;
                        background: #1a1a1a;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                    ">🤖 Android App</a>
                </div>
            </div>
        `;

        const container = document.querySelector('main') || document.body;
        container.insertAdjacentHTML('beforeend', fallbackHTML);
    }

    // Check if app is likely installed (based on timing)
    async checkAppInstalled(testURL, timeout = 2000) {
        return new Promise((resolve) => {
            const start = Date.now();
            
            // Create a hidden iframe to test the URL
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = testURL;
            document.body.appendChild(iframe);

            setTimeout(() => {
                const elapsed = Date.now() - start;
                document.body.removeChild(iframe);
                
                // If less time elapsed than expected, app likely opened
                resolve(elapsed < timeout * 0.5);
            }, timeout);
        });
    }

    // Generate Smart App Banner for iOS
    generateSmartBanner() {
        if (this.detectPlatform() === 'ios') {
            const banner = document.createElement('meta');
            banner.setAttribute('name', 'apple-itunes-app');
            banner.setAttribute('content', `app-id=YOUR_APP_ID`); // Replace with actual App Store ID
            document.head.appendChild(banner);
        }
    }

    // Utility to create QR code for easy mobile access
    generateQRCode(url, containerId) {
        // This would integrate with a QR code library
        // For now, just show the URL
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <p>Scan this QR code with your mobile device:</p>
                    <div style="background: white; padding: 1rem; border-radius: 8px; display: inline-block;">
                        <div style="width: 150px; height: 150px; background: #000; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">
                            QR Code<br/>for<br/>${url}
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Create global instance
window.PodBriefRedirect = new PodBriefRedirect();

// Convenience function for quick redirects
window.redirectToPodBrief = (path, options) => {
    return window.PodBriefRedirect.redirectToApp(path, options);
}; 