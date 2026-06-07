import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LetterEditor } from './LetterEditor'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const letter = await prisma.coverLetter.findUnique({ where: { id }, select: { companyName: true, jobTitle: true } })
  return { title: letter ? `${letter.companyName} — ${letter.jobTitle}` : 'Cover Letter' }
}

export default async function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return notFound()

  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!letter) notFound()

  return <LetterEditor letter={letter as any} tier={session.user.subscriptionTier as any} />
}
