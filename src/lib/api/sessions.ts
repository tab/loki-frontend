export interface Session {
  id: string
  code: string
  status: string
  error?: string
}

export interface User {
  id: string
  identity_number: string
  personal_code: string
  first_name: string
  last_name: string
  access_token: string
  refresh_token: string
}

export async function getSessionStatus({ traceId, sessionId } : { traceId: string; sessionId: string}): Promise<Session> {
  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Trace-ID": traceId,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return res.json()
}

export async function finalizeSession({ traceId, sessionId } : { traceId: string; sessionId: string}): Promise<User> {
  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Trace-ID": traceId,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return res.json()
}
