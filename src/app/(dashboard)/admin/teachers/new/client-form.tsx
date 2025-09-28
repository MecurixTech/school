"use client"

import { useFormStatus } from "react-dom"
import { LoadingOverlay } from "@/components/loading-spinner"

export function FormOverlay() {
  const { pending } = useFormStatus()
  return <LoadingOverlay isLoading={pending} message="Creating Teacher..." />
}
