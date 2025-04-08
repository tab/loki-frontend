"use client"

import React from "react"

import ProtectedRoute from "@/components/routes/BackofficeProtectedRoute"
import Header from "@/components/layout/Header"
import Aside from "@/components/layout/Aside"

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Header position="fixed" />
      <Aside />

      <main style={{ flexGrow: 1, marginLeft: 240, marginTop: 64, padding: 16 }}>
        {children}
      </main>
    </ProtectedRoute>
  )
}
