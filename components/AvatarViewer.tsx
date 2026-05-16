'use client'

interface Props {
  url: string
  hasAnomaly: boolean
}

export default function AvatarViewer({ url, hasAnomaly }: Props) {
  if (!url) return (
    <div className="h-[500px] flex items-center justify-center bg-gray-900 rounded-xl border-2 border-gray-800 text-gray-500 font-mono">
      [ EIDOLON AVATAR OFFLINE - AWAITING DATA ]
    </div>
  )

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-700 ${
      hasAnomaly ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'border-emerald-500'
    }`}>
      {hasAnomaly && (
        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse tracking-widest shadow-lg">
          ⚠ CRITICAL DEVIATION
        </div>
      )}
      <iframe
        src={url}
        width="100%"
        height="500px"
        allow="camera; microphone"
        className="block bg-black"
      />
    </div>
  )
}