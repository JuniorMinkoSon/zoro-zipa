import { api } from './client'

/**
 * Entry-screen visitor. The browser never holds these fields: the backend keeps
 * them and hands back an opaque session token, stored here and echoed on later
 * calls. The same token also arrives as an HttpOnly cookie — that cookie is the
 * preferred channel, but Safari drops it when the site and the API are on
 * different domains, so the stored token is what keeps the visitor recognised.
 */
export interface Visitor {
  id: number
  firstName: string
  lastName: string
  phone: string
  createdAt: string
  lastSeenAt: string
  visits: number
}

export interface VisitorInput {
  firstName: string
  lastName: string
  phone: string
}

interface VisitorSession {
  sessionToken: string
  visitor: Visitor
}

const SESSION_KEY = 'zoro_visitor_session'
const SESSION_HEADER = 'X-Visitor-Session'

// Private windows and blocked site data make localStorage throw on access.
function readToken(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string) {
  try {
    localStorage.setItem(SESSION_KEY, token)
  } catch {
    // No storage available — the cookie remains the only channel.
  }
}

function clearToken() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing to clear.
  }
}

function sessionConfig() {
  const token = readToken()
  return {
    withCredentials: true,
    headers: token ? { [SESSION_HEADER]: token } : undefined,
  }
}

/** The visitor behind the current session, or null when there is none. */
export async function fetchCurrentVisitor(): Promise<Visitor | null> {
  const { status, data } = await api.get<Visitor | ''>('/visitors/me', sessionConfig())
  // The backend answers 204 (empty body) when the session is missing or unknown.
  return status === 204 || !data ? null : (data as Visitor)
}

export async function registerVisitor(input: VisitorInput): Promise<Visitor> {
  const { data } = await api.post<VisitorSession>('/visitors', input, { withCredentials: true })
  writeToken(data.sessionToken)
  return data.visitor
}

/** Closes the session — the stored visitor record is kept server-side. */
export async function forgetVisitor(): Promise<void> {
  await api.delete('/visitors/me', sessionConfig())
  clearToken()
}
