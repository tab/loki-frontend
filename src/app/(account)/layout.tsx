"use client"

import React from "react"

import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Header from "@/components/layout/Header"

export default function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <Header position="static" />
      <main>
        {children}
      </main>
    </ProtectedRoute>
  )
}
