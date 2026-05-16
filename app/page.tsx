'use client'

import { useState } from 'react'
import FileUpload from "@/components/FileUpload";
import AnomalyAlert from "@/components/AnomalyAlert";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* Global Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

      {/* Emergency Red Glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] bg-red-500/10 blur-[120px]" />
      
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

            <p className="mt-3 text-zinc-400 text-xl">
              Digital Forensic Oracle — Upload data. Interview it.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-emerald-300 font-medium tracking-wide">
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="xl:col-span-2 space-y-8">

            {/* Upload */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
              <FileUpload />
            </div>

            {/* Chart Placeholder */}
            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-black p-8 shadow-[0_0_60px_rgba(239,68,68,0.15)]">

              {/* Chart Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:50px_50px]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-red-400">
                    Live Anomaly Detection
                  </h2>

                  <div className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium animate-pulse">
                    MONITORING
                  </div>
                </div>

                <div className="h-[320px] rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden">

                  {/* Animated Scanner */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-400/40 blur-sm animate-[scan_5s_linear_infinite]" />
                  </div>

                  <p className="text-zinc-500 text-lg tracking-[0.3em] relative z-10">
                    FORENSIC DATA VISUALIZATION
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* AI Avatar */}
            <div className="backdrop-blur-2xl bg-white/5 border border-blue-500/20 rounded-3xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.12)]">

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-blue-300">
                  AI Witness
                </h2>

                <div className="flex items-center gap-2 text-blue-300 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  ACTIVE
                </div>
              </div>

              <div className="h-[420px] rounded-2xl border border-blue-500/20 bg-black/40 flex items-center justify-center relative overflow-hidden">

                {/* Blue Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_70%)]" />

                {/* Scanner Animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/40 blur-sm animate-[scan_4s_linear_infinite]" />
                </div>

                <div className="relative z-10 text-center">

                  {/* Floating Orb */}
                  <div className="h-28 w-28 rounded-full border border-blue-400/30 bg-blue-500/10 mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-float">

                    {/* Hologram Pulse */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-blue-400 blur-xl opacity-60 animate-ping" />

                      <div className="relative h-10 w-10 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                  </div>

                  <p className="text-blue-300 text-lg tracking-[0.3em]">
                    EIDOLON AVATAR
                  </p>

                  <p className="mt-3 text-zinc-500 text-sm">
                    {isAnalyzing
                      ? "Analyzing forensic evidence..."
                      : "Awaiting forensic analysis..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="animate-emergency">
              <AnomalyAlert
                title="Critical Financial Anomaly Detected"
                timestamp="02:14 AM"
                severity="critical"
                description="Unauthorized transaction spike detected across multiple endpoints."
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}