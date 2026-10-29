/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class HapticsEngine {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public tap() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(10);
    } catch {
      // Ignore vibration error
    }
  }

  public success() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([25, 40, 35]);
    } catch {
      // Ignore
    }
  }

  public combo() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([30, 30, 40, 30, 50]);
    } catch {
      // Ignore
    }
  }

  public error() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([50, 60, 50]);
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsEngine();
