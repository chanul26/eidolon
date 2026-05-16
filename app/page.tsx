'use client'
import { useState } from 'react'
import AvatarViewer from "@/components/AvatarViewer";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          EIDOLON
        </h1>
        <p className="text-gray-400 mb-8 text-lg">Digital Forensic Oracle — Upload data. Interview it.</p>
        
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center bg-gray-900/50 mb-8">
          <p className="text-gray-400 mb-4">Upload your system logs to begin the forensic analysis.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Select JSON/CSV File
          </button>
        </div>

        <div className="mt-8">
          <AvatarViewer />
        </div>

      </div>
    </main>
  )
}