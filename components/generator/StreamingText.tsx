'use client'

import { useEffect, useRef, useState } from 'react'

interface StreamingTextProps {
  stream: ReadableStream<Uint8Array> | null
  onComplete?: (text: string) => void
  onError?: (error: string) => void
}

export function StreamingText({ stream, onComplete, onError }: StreamingTextProps) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const accumulated = useRef('')

  useEffect(() => {
    if (!stream) return

    accumulated.current = ''
    setText('')
    setDone(false)

    let cancelled = false
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    async function read() {
      try {
        while (true) {
          if (cancelled) break
          const { done: streamDone, value } = await reader.read()
          if (streamDone) break

          const chunk = decoder.decode(value)

          if (chunk.includes('[ERROR:')) {
            let msg = 'Generation failed. Please try again.'
            if (chunk.includes('RATE_LIMITED')) msg = 'High demand right now — try again in 30 seconds.'
            if (chunk.includes('TIMEOUT')) msg = 'Generation timed out. Please try again.'
            onError?.(msg)
            return
          }

          accumulated.current += chunk
          setText(accumulated.current)
        }

        if (!cancelled) {
          setDone(true)
          onComplete?.(accumulated.current)
        }
      } catch (err) {
        if (!cancelled) {
          onError?.('Network error. Please check your connection and try again.')
        }
      }
    }

    read()

    return () => {
      cancelled = true
      reader.cancel().catch(() => {})
    }
  }, [stream])

  return (
    <div className="font-serif text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
      {text}
      {!done && text && (
        <span className="inline-block w-0.5 h-4 bg-[#3B82F6] ml-0.5 animate-[pulse_1s_ease-in-out_infinite]" />
      )}
    </div>
  )
}
