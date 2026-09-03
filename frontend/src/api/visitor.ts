import { api } from './client'

/**
 * Entry-screen visitor. The browser never stores these fields: the backend keeps
 * them and hands back an opaque HttpOnly session cookie, which is why every call
 * here goes out with `withCredentials`.
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

/** The visitor behind the current session cookie, or null when there is none. */
export async function fetchCurrentVisitor(): Promise<Visitor | null> {
  const { status, data } = await api.get<Visitor | ''>('/visitors/me', { withCredentials: true })
  // The backend answers 204 (empty body) when the cookie is missing or unknown.
  return status === 204 || !data ? null : (data as Visitor)
}

export async function registerVisitor(input: VisitorInput): Promise<Visitor> {
  const { data } = await api.post<Visitor>('/visitors', input, { withCredentials: true })
  return data
}

/** Clears the session cookie — the stored visitor record is kept. */
export async function forgetVisitor(): Promise<void> {
  await api.delete('/visitors/me', { withCredentials: true })
}
