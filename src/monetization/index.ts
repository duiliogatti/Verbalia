// Ads and the lifetime Pro purchase sit behind this small interface so the
// rest of the app does not depend on a vendor.
//
// Planned integrations (both need a development build, not Expo Go):
// - Ads: react-native-google-mobile-ads (AdMob), one interstitial after a
//   finished session, never during an exercise.
// - Purchases: react-native-purchases (RevenueCat), one non-consumable
//   product "pro_lifetime".
// Until the store accounts exist, these are no-ops.

export async function showSessionEndAd(isPro: boolean): Promise<void> {
  if (isPro) return;
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'unavailable';

export async function purchasePro(): Promise<PurchaseResult> {
  return 'unavailable';
}

export async function restorePro(): Promise<boolean> {
  return false;
}
