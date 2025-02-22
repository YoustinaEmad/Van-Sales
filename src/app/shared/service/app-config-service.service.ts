import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private transitionCompleted = false;

  constructor() {}

  /**
   * Simulates a transition complete check.
   * Returns `true` when transitions are completed.
   */
  transitionComplete(): boolean {
    return this.transitionCompleted;
  }

  /**
   * Sets the transition state to complete.
   * Call this method when transitions are done.
   */
  setTransitionComplete(state: boolean): void {
    this.transitionCompleted = state;
  }

  /**
   * Retrieves the current preset (theme/design configuration).
   * Modify this method based on your app's configuration logic.
   */
  preset(): boolean {
    // Example implementation: replace with real logic if needed.
    return true;
  }
}
