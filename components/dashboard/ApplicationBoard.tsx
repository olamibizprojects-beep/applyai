'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { ApplicationRecord, Stage } from '@/types'

const STAGES: Stage[] = ['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND', 'OFFER', 'REJECTED', 'WITHDRAWN']
const STAGE_LABELS: Record<Stage, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  FINAL_ROUND: 'Final Round',
  OFFER: 'Offer 🎉',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}
const STAGE_COLORS: Record<Stage, string> = {
  APPLIED: 'bg-blue-50 border-blue-200',
  PHONE_SCREEN: 'bg-purple-50 border-purple-200',
  INTERVIEW: 'bg-amber-50 border-amber-200',
  FINAL_ROUND: 'bg-orange-50 border-orange-200',
  OFFER: 'bg-green-50 border-green-200',
  REJECTED: 'bg-red-50 border-red-200',
  WITHDRAWN: 'bg-gray-50 border-gray-200',
}

function AppCard({ app }: { app: ApplicationRecord }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: app.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-[#E2E8F0] p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <p className="font-medium text-sm text-[#0F172A] truncate">{app.companyName}</p>
      <p className="text-xs text-[#64748B] truncate mt-0.5">{app.jobTitle}</p>
      <p className="text-[10px] text-[#94A3B8] mt-2">{new Date(app.appliedAt).toLocaleDateString()}</p>
    </div>
  )
}

interface ApplicationBoardProps {
  initialApps: ApplicationRecord[]
}

export function ApplicationBoard({ initialApps }: ApplicationBoardProps) {
  const [apps, setApps] = useState(initialApps)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const draggedApp = apps.find((a) => a.id === active.id)
    const targetStage = over.id as Stage

    if (!draggedApp || !STAGES.includes(targetStage)) return

    // Optimistic update
    setApps((prev) => prev.map((a) => a.id === draggedApp.id ? { ...a, stage: targetStage } : a))

    try {
      await fetch(`/api/applications/${draggedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: targetStage }),
      })
    } catch {
      // Revert on error
      setApps(initialApps)
      toast.error('Failed to update application stage')
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = apps.filter((a) => a.stage === stage)
          return (
            <div key={stage} className="flex-shrink-0 w-56">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{STAGE_LABELS[stage]}</h3>
                <span className="text-xs text-[#94A3B8] font-medium">{stageApps.length}</span>
              </div>

              <SortableContext items={stageApps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <div
                  className={`min-h-[300px] rounded-xl border-2 border-dashed p-2 space-y-2 transition-colors ${
                    stageApps.length === 0 ? 'border-[#E2E8F0]' : STAGE_COLORS[stage]
                  }`}
                >
                  {stageApps.map((app) => <AppCard key={app.id} app={app} />)}
                  {stageApps.length === 0 && (
                    <p className="text-xs text-[#94A3B8] text-center pt-8">Drop here</p>
                  )}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}
