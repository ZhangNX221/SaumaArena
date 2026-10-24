/**
 * Feature flags for Sauma Arena.
 * Controlled globally to enable/disable specific modules across Public, Admin, and Referee views.
 */
export const FEATURES = {
  /**
   * Ticketing system feature flag.
   * When set to false:
   * - Admin: The 'TIKET MASUK' menu group (Kuota Tiket, Riwayat Transaksi, Pindai Tiket) is hidden.
   * - Public: The 'BELI TIKET' buttons and triggers are hidden.
   * When toggled to true, ticketing features reappear without any other code changes.
   */
  ticketing: false,
};
