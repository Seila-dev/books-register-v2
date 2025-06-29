'use client'

import { useState } from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import { Category } from '@/types/categoryData'

export function EditCategoryName({
  initialName,
  onSave,
  onCancel,
}: {
  initialName: string
  onSave: (newName: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialName)

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
        placeholder="Nome da categoria"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            onSave(name)
            e.stopPropagation()
          }}
          className="flex items-center gap-1 px-3 py-1 bg-green-600/80 hover:bg-green-600 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <Check size={14} /> Salvar
        </button>
        <button
          onClick={(e) => {
            onCancel()
            e.stopPropagation()
          }}
          className="flex items-center gap-1 px-3 py-1 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <X size={14} /> Cancelar
        </button>
      </div>
    </div>
  )
}