import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "@/config/env"
import { v7 as uuid } from "uuid"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const traceId = req.headers.get("X-Trace-ID") || uuid()

  try {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
        "X-Trace-ID": traceId,
      }
    })

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
