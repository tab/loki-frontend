import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "@/config/env"
import { v7 as uuid } from "uuid"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const traceId = req.headers.get("X-Trace-ID") || uuid()

  try {
    const response = await fetch(`${API_URL}/tokens/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Trace-ID": traceId,
      },
      body: JSON.stringify(body),
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
