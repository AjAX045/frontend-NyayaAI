'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PoliceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const officer = localStorage.getItem('officer')

    if (!officer) {
      router.replace('/police/login')
    } else {
      setChecked(true)
    }
  }, [router])

  // ⛔ Prevent rendering until auth check finishes
  if (!checked) return null

  return <>{children}</>
}
