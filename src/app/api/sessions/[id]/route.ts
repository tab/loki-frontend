import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "@/config/env"
import { v7 as uuid } from "uuid"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params

  const traceId = req.headers.get("X-Trace-ID") || uuid()

  try {
    const response = await fetch(`${API_URL}/sessions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Trace-ID": traceId,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params

  const traceId = req.headers.get("X-Trace-ID") || uuid()

  try {
    const response = await fetch(`${API_URL}/sessions/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Trace-ID": traceId,
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
