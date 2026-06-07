import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const patchSchema = z.object({
  content: z.string().max(20000).optional(),
  status: z.enum(['DRAFT', 'FINAL', 'SENT']).optional(),
  atsScore: z.number().min(0).max(100).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const letter = await prisma.coverLetter.findFirst({ where: { id, userId: session.user.id } })
  if (!letter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(letter)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const letter = await prisma.coverLetter.findFirst({ where: { id, userId: session.user.id } })
  if (!letter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.coverLetter.update({ where: { id }, data: parsed.data })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const letter = await prisma.coverLetter.findFirst({ where: { id, userId: session.user.id } })
  if (!letter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.coverLetter.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
