import { House } from '@phosphor-icons/react/dist/ssr'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <div className="text-center">
        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-green-200 animate-pulse" />
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center text-white">
            <House size={30} weight="fill" />
          </div>
        </div>
        <p className="text-gray-600">Finding your perfect home...</p>
      </div>
    </div>
  )
}
