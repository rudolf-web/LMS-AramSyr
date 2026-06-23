/**
 * Safe, robust wrappers for `window.confirm` and `window.alert` to prevent
 * failures and blockages inside Sandboxed iFrames in preview environments.
 */

export const safeConfirm = (message: string, defaultValue = true): boolean => {
  try {
    if (typeof window === "undefined" || !window.confirm) {
      return defaultValue;
    }
    return window.confirm(message);
  } catch (err) {
    console.warn("Native confirm blocked by browser iframe sandbox, auto-approving action:", message, err);
    return defaultValue;
  }
};

export const safeAlert = (message: string): void => {
  try {
    if (typeof window === "undefined" || !window.alert) {
      console.log("ALERT:", message);
      return;
    }
    window.alert(message);
  } catch (err) {
    console.warn("Native alert blocked by browser iframe sandbox:", message, err);
  }
};
