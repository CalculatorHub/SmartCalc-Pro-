/**
 * Triggers a short vibration on supported mobile devices using the HTML5 Vibration API.
 * Safely falls back if the API is not supported or not allowed.
 */
export const triggerHaptic = (style: 'light' | 'medium' | 'success' | 'warning' | 'error' | number = 'light') => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      // Some browsers have restrictions where vibrate doesn't run without user interaction.
      // But since we trigger this in click/tap handlers, it is valid!
      if (typeof style === 'number') {
        navigator.vibrate(style);
        return;
      }
      
      switch (style) {
        case 'light':
          navigator.vibrate(10); // Short subtle pulse for taps
          break;
        case 'medium':
          navigator.vibrate(22); // Slightly stronger pulse for selections/toggles
          break;
        case 'success':
          navigator.vibrate([15, 40, 15]); // Double pulse for saving/success states
          break;
        case 'warning':
          navigator.vibrate([30, 40, 30]); // Warning vibe
          break;
        case 'error':
          navigator.vibrate([60, 50, 60]); // Distinct error feel
          break;
        default:
          navigator.vibrate(15);
      }
    } catch (e) {
      // Silently catch any security / iframe block exceptions
    }
  }
};
