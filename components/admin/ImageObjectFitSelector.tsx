'use client'

import React from 'react'

type ObjectFit = 'cover' | 'contain' | 'fill'

type ImageObjectFitSelectorProps = {
  value: ObjectFit
  onChange: (value: ObjectFit) => void
}

export default function ImageObjectFitSelector({ value, onChange }: ImageObjectFitSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-gray-700">Image Display Mode</label>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onChange('cover')}
          className={`rounded-lg border-2 px-3 py-2.5 text-left transition ${
            value === 'cover'
              ? 'border-[#1A5C38] bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-gray-900">Cover (Crop)</p>
          <p className="mt-0.5 text-[10px] text-gray-500">Fills space, may crop edges</p>
        </button>
        <button
          type="button"
          onClick={() => onChange('contain')}
          className={`rounded-lg border-2 px-3 py-2.5 text-left transition ${
            value === 'contain'
              ? 'border-[#1A5C38] bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-gray-900">Fit (Contain)</p>
          <p className="mt-0.5 text-[10px] text-gray-500">Shows full image, may have gaps</p>
        </button>
        <button
          type="button"
          onClick={() => onChange('fill')}
          className={`rounded-lg border-2 px-3 py-2.5 text-left transition ${
            value === 'fill'
              ? 'border-[#1A5C38] bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-gray-900">Stretch (Fill)</p>
          <p className="mt-0.5 text-[10px] text-gray-500">Fills space, may distort</p>
        </button>
      </div>
    </div>
  )
}
