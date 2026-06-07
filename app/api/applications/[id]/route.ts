import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const patchSchema = z.object({
  stage: z.enum(['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND', 'OFFER', 'REJECTED', 'WITHDRAWN']).optional(),
  notes: z.string().max(5000).optional(),
  followUpAt: z.string().datetime().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const app = await prisma.application.findFirst({ where: { id, userId: session.user.id } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...parsed.data,
      followUpAt: parsed.data.followUpAt ? new Date(parsed.data.followUpAt) : undefined,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const app = await prisma.application.findFirst({ where: { id, userId: session.user.id } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.application.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
