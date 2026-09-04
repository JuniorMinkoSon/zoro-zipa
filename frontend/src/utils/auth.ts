/** Logout helper. Only administrators sign in — the public site has no accounts. */
import { logout as clearSession } from '../api/auth'

/** Clears the session and reloads so AccessGate shows the admin login screen again. */
export function logoutAdmin() {
  clearSession()
  window.location.href = '/admin'
}
