'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCEPTED_TYPES = ['.json', '.csv']
const ACCEPTED_MIME = 'application/json,text/csv,.json,.csv'

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith('.json') || name.endsWith('.csv')
}

export type FileUploadProps = {
  onFileSelect?: (file: File) => void
  className?: string
}

export default function FileUpload({ onFileSelect, className = '' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!isAcceptedFile(file)) {
        setError('Only JSON and CSV files are supported.')
        setFileName(null)
        return
      }
      setError(null)
      setFileName(file.name)
      onFileSelect?.(file)
    },
    [onFileSelect],
  )

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  const openFilePicker = () => inputRef.current?.click()

  return (
    <motion.div
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME}
        className="sr-only"
        onChange={onInputChange}
        aria-hidden
      />

      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Upload JSON or CSV file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFilePicker()
          }
        }}
        onClick={openFilePicker}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="group relative cursor-pointer overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {/* Ambient grid */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
          animate={{ opacity: isDragging ? 0.14 : 0.07 }}
        />

        {/* Red glow on hover / drag */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          animate={{
            opacity: isDragging ? 1 : 0,
            boxShadow: isDragging
              ? '0 0 60px rgba(239, 68, 68, 0.35), 0 0 120px rgba(239, 68, 68, 0.15), inset 0 0 40px rgba(239, 68, 68, 0.08)'
              : '0 0 0px transparent',
          }}
          transition={{ duration: 0.3 }}
        />
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 shadow-[0_0_50px_rgba(239,68,68,0.25),0_0_100px_rgba(239,68,68,0.1)] transition-opacity duration-500 group-hover:opacity-100" />

        {/* Glass panel */}
        <div
          className={`
            relative border px-6 py-10 sm:px-10 sm:py-14
            backdrop-blur-xl
            transition-all duration-500 ease-out
            ${
              isDragging
                ? 'border-red-500/50 bg-red-950/20'
                : 'border-white/10 bg-white/[0.03] group-hover:border-red-500/40 group-hover:bg-red-950/10'
            }
          `}
          style={{
            borderRadius: '1rem',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Scan line */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
            animate={{ y: isDragging ? [0, 280, 0] : [0, 200, 0] }}
            transition={{
              duration: isDragging ? 2 : 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-500/[0.03] to-transparent"
            animate={{ opacity: isDragging ? 0.8 : 0.4 }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center text-center"
            animate={{ y: isDragging ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {/* Icon */}
            <motion.div
              className="mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl border border-white/10 bg-black/30 shadow-inner"
              animate={{
                scale: isDragging ? 1.08 : 1,
                borderColor: isDragging ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <svg
                className="h-8 w-8 sm:h-9 sm:w-9 text-red-400/90 transition-colors duration-300 group-hover:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>

            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-red-400/70">
              Secure Evidence Intake
            </p>

            <h2 className="mt-3 font-sans text-xl font-light tracking-tight text-white/95 sm:text-2xl">
              {isDragging ? 'Release to ingest' : 'Drop forensic data here'}
            </h2>

            <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-zinc-500 sm:text-base">
              System logs, audit trails, and structured evidence in{' '}
              <span className="font-mono text-zinc-400">{ACCEPTED_TYPES.join(' · ')}</span>
            </p>

            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openFilePicker()
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-red-100/90 shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-300 hover:border-red-400/60 hover:bg-red-900/40 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] sm:px-8 sm:py-3 sm:text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              Select JSON / CSV
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* File name & status */}
      <AnimatePresence mode="wait">
        {(fileName || error) && (
          <motion.div
            key={fileName ?? error}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="mt-4 flex items-center justify-center gap-3 px-2"
          >
            {fileName && !error && (
              <>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="font-mono text-sm text-zinc-400">
                  <span className="text-zinc-600">ingested › </span>
                  <span className="text-emerald-400/90">{fileName}</span>
                </p>
              </>
            )}
            {error && (
              <p className="font-mono text-sm text-red-400/90">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
