import { Suspense } from 'react'
import RegisterContent from './RegisterContent'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0d4f2e]">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
