import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.id) redirect('/login')

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          subscriptionTier: session.user.subscriptionTier ?? 'FREE',
          generationsUsed: session.user.generationsUsed ?? 0,
        }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
}
