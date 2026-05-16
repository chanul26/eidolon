'use client';

export default function AvatarViewer() {
  // Hardcoded for instant testing!
  const avatarUrl = "https://bey.chat/bf8babbd-841a-405f-b911-1a9cd6a63895";

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border border-zinc-800 bg-black rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      {/* Hacker-style Top Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex justify-between items-center">
        <span className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
          Eidolon // Forensic_AI_Active
        </span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 text-xs font-mono">SYS_ONLINE</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
      
      {/* The Beyond Presence Agent */}
      <iframe
        src={avatarUrl}
        allow="microphone; camera; autoplay"
        className="w-full h-full border-none"
        title="EIDOLON Diagnostic Avatar"
      />
    </div>
  );
}