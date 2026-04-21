'use client'

import React, { useState, useRef, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

/**
 * Multi-tag chip input.
 * Press Enter or comma to add a tag. Click × to remove.
 * Admin should add BOTH native script tags AND English phonetic equivalents
 * so search works regardless of which keyboard the user types with.
 *
 * Example for a Telugu recipe "రాగి అంబలి":
 *   Tags: రాగి అంబలి | ragi ambali | ragi porridge | finger millet
 */
export default function TagsInput({ tags, onChange, placeholder }: TagsInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (raw: string) => {
    const val = raw.trim().toLowerCase()
    if (!val || tags.includes(val)) { setInput(''); return }
    onChange([...tags, val])
    setInput('')
  }

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx))
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div
      className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-[#1A5C38] focus-within:ring-1 focus-within:ring-[#1A5C38] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span key={i}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
          {tag}
          <button type="button" onClick={() => removeTag(i)}
            className="text-emerald-500 hover:text-emerald-700">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) addTag(input) }}
        placeholder={tags.length === 0 ? (placeholder ?? 'Add tags… press Enter or comma') : ''}
        className="min-w-[140px] flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  )
}
