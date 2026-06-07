import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up
  await prisma.application.deleteMany()
  await prisma.coverLetter.deleteMany()
  await prisma.resume.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  const sampleLetter = `Dear Hiring Manager,

Acme Corp's mission to simplify enterprise workflows is exactly the challenge I've spent the last four years solving — most recently cutting onboarding time 45% at Stripe by redesigning the integration layer from the ground up.

As a senior software engineer at Stripe, I shipped payment infrastructure that processed $2B in annual volume and led a team of six engineers to a 93% sprint velocity over two consecutive quarters. Previously at Twilio, I reduced API response latency by 38% through targeted query optimization — directly aligned with the performance challenges described in your job posting.

In my first 90 days at Acme, I'd map the existing architecture, build relationships with the infrastructure team, and ship one measurable improvement. I'd welcome the chance to discuss how my background fits what you're building — when works for you?

Sincerely,
[Candidate Name]`

  // Free tier user
  const freeUser = await prisma.user.create({
    data: {
      email: 'free@test.applyai.com',
      name: 'Alex Free',
      emailVerified: new Date(),
      subscriptionTier: 'FREE',
      generationsUsed: 2,
      generationsResetAt: new Date(new Date().setDate(1)),
    },
  })

  await prisma.coverLetter.create({
    data: {
      userId: freeUser.id,
      companyName: 'Google',
      jobTitle: 'Software Engineer L4',
      jobDescription: 'We are looking for a Software Engineer to join our team...',
      tone: 'PROFESSIONAL',
      content: sampleLetter,
      status: 'DRAFT',
    },
  })

  // Basic tier user
  const basicUser = await prisma.user.create({
    data: {
      email: 'basic@test.applyai.com',
      name: 'Jordan Basic',
      emailVerified: new Date(),
      subscriptionTier: 'BASIC',
      generationsUsed: 12,
      generationsResetAt: new Date(new Date().setDate(1)),
    },
  })

  const basicResume = await prisma.resume.create({
    data: {
      userId: basicUser.id,
      name: 'Main Resume',
      content: 'Jordan Basic\n\nSenior Product Manager with 6 years of experience...',
      isDefault: true,
    },
  })

  for (const [company, title, tone] of [
    ['Stripe', 'Senior Product Manager', 'PROFESSIONAL'],
    ['Figma', 'Product Lead', 'ENTHUSIASTIC'],
    ['Linear', 'PM', 'CONCISE'],
  ]) {
    const letter = await prisma.coverLetter.create({
      data: {
        userId: basicUser.id,
        resumeId: basicResume.id,
        companyName: company as string,
        jobTitle: title as string,
        jobDescription: `${company} is hiring a ${title}...`,
        tone: tone as 'PROFESSIONAL' | 'ENTHUSIASTIC' | 'CONCISE' | 'CREATIVE',
        content: sampleLetter,
        status: company === 'Stripe' ? 'FINAL' : 'DRAFT',
      },
    })

    await prisma.application.create({
      data: {
        userId: basicUser.id,
        coverLetterId: letter.id,
        companyName: company as string,
        jobTitle: title as string,
        stage: company === 'Stripe' ? 'INTERVIEW' : company === 'Figma' ? 'PHONE_SCREEN' : 'APPLIED',
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    })
  }

  // Pro tier user
  const proUser = await prisma.user.create({
    data: {
      email: 'pro@test.applyai.com',
      name: 'Sam Pro',
      emailVerified: new Date(),
      subscriptionTier: 'PRO',
      generationsUsed: 47,
      generationsResetAt: new Date(new Date().setDate(1)),
    },
  })

  for (const [company, title, stage, ats] of [
    ['Anthropic', 'Staff Engineer', 'FINAL_ROUND', 87],
    ['OpenAI', 'Senior ML Engineer', 'OFFER', 92],
    ['Vercel', 'DX Engineer', 'INTERVIEW', 74],
    ['Notion', 'Software Engineer', 'APPLIED', 68],
  ]) {
    const letter = await prisma.coverLetter.create({
      data: {
        userId: proUser.id,
        companyName: company as string,
        jobTitle: title as string,
        jobDescription: `${company} is hiring a ${title}...`,
        tone: 'PROFESSIONAL',
        content: sampleLetter,
        status: stage === 'OFFER' ? 'SENT' : 'FINAL',
        atsScore: ats as number,
        atsKeywords: ['TypeScript', 'React', 'Node.js', 'API design'],
      },
    })

    await prisma.application.create({
      data: {
        userId: proUser.id,
        coverLetterId: letter.id,
        companyName: company as string,
        jobTitle: title as string,
        stage: stage as 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'FINAL_ROUND' | 'OFFER' | 'REJECTED' | 'WITHDRAWN',
        appliedAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log('  FREE user: free@test.applyai.com')
  console.log('  BASIC user: basic@test.applyai.com')
  console.log('  PRO user: pro@test.applyai.com')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
