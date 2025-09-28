"use client"

import { useState, useEffect, useRef } from "react"

interface Message {
  _id: string
  senderId: string
  senderRole: "user" | "admin"
  senderName: string
  message: string
  createdAt: string
}

export function useRealTimeChat(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!chatId) {
      // console.log("useRealTimeChat - No chatId, clearing messages")
      setMessages([])
      setIsConnected(false)
      return
    }

    // console.log("useRealTimeChat - Setting up SSE for chatId:", chatId)

    // Close existing connection
    if (eventSourceRef.current) {
      // console.log("useRealTimeChat - Closing existing connection")
      eventSourceRef.current.close()
    }

    // Create new SSE connection
    const eventSource = new EventSource(`/api/chat/${chatId}/stream`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      // console.log("useRealTimeChat - SSE connection opened for chat:", chatId)
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // console.log("useRealTimeChat - Received SSE data:", data.type)

        if (data.type === "connected") {
          // console.log("useRealTimeChat - Connected to chat stream:", data.chatId)
        } else if (data.type === "message") {
          // console.log("useRealTimeChat - New message received:", data.message._id)
          setMessages((prev) => {
            // Avoid duplicates
            const exists = prev.some((msg) => msg._id === data.message._id)
            if (exists) {
              // console.log("useRealTimeChat - Message already exists, skipping")
              return prev
            }
            // console.log("useRealTimeChat - Adding new message to state")
            return [...prev, data.message]
          })
        }
      } catch (error) {
        // console.error("useRealTimeChat - Error parsing SSE data:", error)
      }
    }

    eventSource.onerror = (error) => {
      // console.error("useRealTimeChat - SSE error:", error)
      setIsConnected(false)
    }

    // Cleanup on unmount or chatId change
    return () => {
      // console.log("useRealTimeChat - Cleaning up SSE connection")
      eventSource.close()
      setIsConnected(false)
    }
  }, [chatId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        // console.log("useRealTimeChat - Final cleanup")
        eventSourceRef.current.close()
      }
    }
  }, [])

  return { messages, isConnected, setMessages }
}
