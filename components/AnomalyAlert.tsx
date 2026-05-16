'use client'

import { motion } from 'framer-motion'

export type Severity = 'none' | 'warning' | 'critical'

export type AnomalyAlertProps = {
  title: string
  timestamp: string | Date
  severity: Severity
  description: string
  className?: string
  onDismiss?: () => void
}

const SEVERITY_CONFIG: Record<
  Severity,
  {
    label: string
    badge: string
    border: string
    glow: string
    accent: string
    indicator: string
    code: string
  }
> = {
  critical: {
    label: 'CRITICAL',
    badge: 'border-red-500/50 bg-red-950/50 text-red-300',
    border: 'border-red-500/40',
    glow: 'rgba(239, 68, 68, 0.45)',
    accent: 'text-red-400',
    indicator: 'text-red-500',
    code: 'EID-CRIT',
  },
  warning: {
    label: 'WARNING',
    badge: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.25)',
    accent: 'text-amber-400',
    indicator: 'text-amber-500',
    code: 'EID-WARN',
  },
  none: {
    label: 'INFO',
    badge: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300',
    border: 'border-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
    indicator: 'text-emerald-500',
    code: 'EID-INFO',
  },
}

function formatTimestamp(ts: string | Date): string {
  const date = typeof ts === 'string' ? new Date(ts) : ts
  if (Number.isNaN(date.getTime())) return String(ts)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function WarningIndicator({ severity }: { severity: Severity }) {
  const config = SEVERITY_CONFIG[severity]
  const isCritical = severity === 'critical'

  return (
    <motion.div
      className="relative flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }}
    >
      {isCritical && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-red-500/40"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-1 rounded-full border border-red-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
          />
        </>
      )}

      <motion.div
        className={`relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 sm:h-11 sm:w-11 ${config.indicator}`}
        animate={
          isCritical
            ? {
                boxShadow: [
                  '0 0 12px rgba(239,68,68,0.3)',
                  '0 0 28px rgba(239,68,68,0.55)',
                  '0 0 12px rgba(239,68,68,0.3)',
                ],
              }
            : undefined
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
          animate={isCritical ? { rotate: [0, -2, 2, 0] } : undefined}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

export default function AnomalyAlert({
  title,
  timestamp,
  severity,
  description,
  className = '',
  onDismiss,
}: AnomalyAlertProps) {
  const config = SEVERITY_CONFIG[severity]
  const isCritical = severity === 'critical'

  return (
    <motion.article
      role="alert"
      aria-live={isCritical ? 'assertive' : 'polite'}
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Pulsing outer glow */}
      {isCritical && (
        <motion.div
          className="pointer-events-none absolute -inset-1 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 24px ${config.glow}, 0 0 48px rgba(239,68,68,0.12)`,
              `0 0 40px ${config.glow}, 0 0 80px rgba(239,68,68,0.2)`,
              `0 0 24px ${config.glow}, 0 0 48px rgba(239,68,68,0.12)`,
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        className={`
          relative overflow-hidden rounded-2xl border backdrop-blur-xl
          ${config.border} bg-white/[0.03]
        `}
        style={{
          boxShadow:
            'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 20px 40px -16px rgba(0,0,0,0.6)',
        }}
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Grid overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
          animate={{ opacity: isCritical ? [0.06, 0.1, 0.06] : 0.06 }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Top scan bar */}
        <motion.div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${config.accent}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Critical pulse wash */}
        {isCritical && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-red-500/10 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <WarningIndicator severity={severity} />

          <div className="min-w-0 flex-1">
            <motion.div
              className="flex flex-wrap items-center gap-2 sm:gap-3"
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                {config.code}
              </span>
              <span
                className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${config.badge}`}
              >
                {isCritical && (
                  <motion.span
                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {config.label}
              </span>
            </motion.div>

            <motion.h3
              className="mt-2 font-sans text-lg font-medium tracking-tight text-white/95 sm:text-xl"
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {title}
            </motion.h3>

            <motion.div
              className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              <time
                dateTime={
                  typeof timestamp === 'string'
                    ? timestamp
                    : timestamp.toISOString()
                }
                className="font-mono text-xs text-zinc-500"
              >
                <span className="text-zinc-600">detected </span>
                {formatTimestamp(timestamp)}
              </time>
              <span className="hidden h-3 w-px bg-white/10 sm:inline" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                AI Forensic Engine v2
              </span>
            </motion.div>

            <motion.p
              className="mt-3 text-sm font-light leading-relaxed text-zinc-400 sm:text-[15px]"
              variants={{
                hidden: { opacity: 0, y: 4 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {description}
            </motion.p>
          </div>

          {onDismiss && (
            <motion.button
              type="button"
              onClick={onDismiss}
              className="absolute right-4 top-4 rounded-md p-1 font-mono text-xs text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-400"
              aria-label="Dismiss alert"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          )}
        </motion.div>

        {/* Bottom status strip */}
        <motion.div
          className="relative border-t border-white/5 bg-black/20 px-5 py-2 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Anomaly signature logged · awaiting operator review
            </p>
            {isCritical && (
              <motion.span
                className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-red-500/80"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ● Live
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  )
}
