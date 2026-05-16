'use client'

import { useState } from 'react'
import FileUpload from "@/components/FileUpload";
import AnomalyAlert from "@/components/AnomalyAlert";
import AvatarViewer from '@/components/AvatarViewer';
import { createAvatarSession } from '@/lib/bey';

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [hasAnomaly, setHasAnomaly] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  async function handleUpload(file: File) {
    setIsAnalyzing(true)
    try {
      // 1. Upload and Parse
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
      if (!uploadRes.ok) throw new Error("Upload failed")
      const { data } = await uploadRes.json()

      // 2. OpenAI Analysis
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      if (!analyzeRes.ok) throw new Error("Analysis failed")
      const result = await analyzeRes.json()
      
      setHasAnomaly(result.hasAnomaly)
      setAnalysisData(result)
      
      // 3. Trigger Beyond Presence Avatar
      const session = await createAvatarSession(result.systemPrompt)
      setAvatarUrl(session.url || session.conversation_url || session.room_url) 

    } catch (error) {
      console.error("EIDOLON Pipeline failed:", error)
      alert("Error processing the dataset. Check the console.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans">
      {/* Global Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
      {/* Emergency Red Glow */}
      {hasAnomaly && <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] bg-red-500/20 blur-[120px]" />}
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              EIDOLON
            </h1>
            <p className="mt-3 text-zinc-400 text-xl">Digital Forensic Oracle — Upload data. Interview it.</p>
          </div>
          <div className={`flex items-center gap-3 border px-5 py-3 rounded-2xl backdrop-blur-xl ${hasAnomaly ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]'}`}>
            <div className={`h-3 w-3 rounded-full animate-pulse ${hasAnomaly ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className={`font-medium tracking-wide ${hasAnomaly ? 'text-red-300' : 'text-emerald-300'}`}>
              {hasAnomaly ? 'CRITICAL ALERT' : 'SYSTEM ONLINE'}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT SIDE: Uploader & Scanner */}
          <div className="xl:col-span-2 space-y-8">
            {!avatarUrl && (
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
                <FileUpload onFileSelect={handleUpload} isLoading={isAnalyzing} />
              </div>
            )}

            {/* Live Anomaly Detection Scanner */}
            {avatarUrl && (
              <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 ${hasAnomaly ? 'border-red-500/20 from-red-500/10 to-black shadow-[0_0_60px_rgba(239,68,68,0.15)]' : 'border-emerald-500/20 from-emerald-500/10 to-black shadow-[0_0_60px_rgba(16,185,129,0.15)]'}`}>
                <div className="absolute inset-0 opacity-10">
                  <div className={`h-full w-full bg-[linear-gradient(to_right,${hasAnomaly ? '#ef4444' : '#10b981'}_1px,transparent_1px),linear-gradient(to_bottom,${hasAnomaly ? '#ef4444' : '#10b981'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${hasAnomaly ? 'text-red-400' : 'text-emerald-400'}`}>Live Data Stream</h2>
                    <div className={`px-4 py-2 rounded-full border text-sm font-medium animate-pulse ${hasAnomaly ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                      {hasAnomaly ? 'ANOMALY DETECTED' : 'MONITORING'}
                    </div>
                  </div>
                  <div className="h-[320px] rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-1 blur-sm animate-[scan_5s_linear_infinite] ${hasAnomaly ? 'bg-red-400/40' : 'bg-emerald-400/40'}`} />
                    </div>
                    <div className="text-zinc-500 text-lg tracking-[0.3em] relative z-10 text-center px-4">
                      {analysisData?.details ? analysisData.details : "FORENSIC DATA VISUALIZATION ACTIVE"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Avatar & Alert */}
          <div className="space-y-8">
            <div className={`backdrop-blur-2xl bg-white/5 border rounded-3xl p-6 transition-colors duration-500 ${hasAnomaly ? 'border-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.12)]' : 'border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.12)]'}`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-2xl font-bold ${hasAnomaly ? 'text-red-300' : 'text-blue-300'}`}>AI Witness</h2>
              </div>
              
              {/* Ravindu's Avatar Renders Here */}
              {avatarUrl ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <AvatarViewer url={avatarUrl} hasAnomaly={hasAnomaly} />
                </div>
              ) : (
                <div className={`h-[420px] rounded-2xl border bg-black/40 flex items-center justify-center relative overflow-hidden ${hasAnomaly ? 'border-red-500/20' : 'border-blue-500/20'}`}>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/40 blur-sm animate-[scan_4s_linear_infinite]" />
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="h-28 w-28 rounded-full border border-blue-400/30 bg-blue-500/10 mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-float">
                      <div className="relative h-10 w-10 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                    <p className="text-blue-300 text-lg tracking-[0.3em]">EIDOLON AVATAR</p>
                    <p className="mt-3 text-zinc-500 text-sm">
                      {isAnalyzing ? "Analyzing forensic evidence..." : "Awaiting forensic analysis..."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Alert System */}
            {hasAnomaly && analysisData && (
              <div className="animate-emergency">
                <AnomalyAlert
                  title="Critical Deviation Detected"
                  timestamp={new Date().toISOString()}
                  severity="critical"
                  description={analysisData.summary || "Unauthorized access or failure detected in system logs."}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}