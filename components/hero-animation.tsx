'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Layers, Database, Globe, Rocket } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────
   Story: Your idea → Interface → Database → Deployed → Done
   Five cards on a gentle zigzag path.
   A glowing dot travels left → right, repeating.
   Each card cascades in on mount.
───────────────────────────────────────────────────────────────── */

const stages = [
  {
    Icon: Lightbulb,
    label: 'Your idea',
    cx: 60,
    cy: 190,
    accent: false,
  },
  {
    Icon: Layers,
    label: 'Interface',
    cx: 165,
    cy: 105,
    accent: false,
  },
  {
    Icon: Database,
    label: 'Database',
    cx: 260,
    cy: 180,
    accent: false,
  },
  {
    Icon: Globe,
    label: 'Deployed',
    cx: 355,
    cy: 100,
    accent: false,
  },
  {
    Icon: Rocket,
    label: 'Done ✦',
    cx: 450,
    cy: 185,
    accent: true, // highlighted — the goal
  },
]

// Smooth bezier path through all 5 points
const flowPath =
  `M 60,190 C 95,190 130,105 165,105 ` +
  `C 200,105 225,180 260,180 ` +
  `C 295,180 320,100 355,100 ` +
  `C 390,100 420,185 450,185`

// Cascading pulse delays — flows left to right
const pulseTimes = [0, 0.9, 1.8, 2.7, 3.5]
const TOTAL_DURATION = 5

export function HeroAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 520 290"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* ── Connecting path ────────────────────────────────── */}
        <motion.path
          d={flowPath}
          stroke="#E5E2D9"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
        />

        {/* ── Glowing travel dot ─────────────────────────────── */}
        {/* Outer glow */}
        <motion.circle
          r={9}
          fill="#C96B3A"
          opacity={0.2}
          animate={{
            cx: stages.map((s) => s.cx),
            cy: stages.map((s) => s.cy),
            opacity: [0, 0.2, 0.2, 0.2, 0.2, 0],
          }}
          transition={{
            duration: TOTAL_DURATION,
            delay: 2.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
        />
        {/* Inner dot */}
        <motion.circle
          r={5}
          fill="#C96B3A"
          animate={{
            cx: stages.map((s) => s.cx),
            cy: stages.map((s) => s.cy),
            opacity: [0, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration: TOTAL_DURATION,
            delay: 2.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
        />

        {/* ── Stage cards ────────────────────────────────────── */}
        {stages.map((stage, i) => {
          const W = 62, H = 62
          const x = stage.cx - W / 2
          const y = stage.cy - H / 2

          return (
            <g key={stage.label}>
              {/* Card pulse ring — cascades through cards */}
              <motion.rect
                x={x} y={y} width={W} height={H} rx={14}
                fill="none"
                stroke="#C96B3A"
                strokeWidth="1.5"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 1.0,
                  delay: 2.2 + pulseTimes[i],
                  repeat: Infinity,
                  repeatDelay: TOTAL_DURATION - 1,
                  ease: 'easeOut',
                }}
              />

              {/* Card background */}
              <motion.rect
                x={x} y={y} width={W} height={H} rx={14}
                fill={stage.accent ? '#C96B3A' : '#FAFAF7'}
                stroke={stage.accent ? 'none' : '#E5E2D9'}
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: `${stage.cx}px ${stage.cy}px` }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + i * 0.12,
                  type: 'spring',
                  stiffness: 220,
                  damping: 16,
                }}
              />

              {/* Icon via foreignObject */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.12 }}
              >
                <foreignObject
                  x={stage.cx - 13}
                  y={stage.cy - 13}
                  width={26}
                  height={26}
                >
                  <div
                    // @ts-ignore — xmlns required for foreignObject
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stage.Icon
                      size={20}
                      color={stage.accent ? '#ffffff' : '#C96B3A'}
                      strokeWidth={1.6}
                    />
                  </div>
                </foreignObject>
              </motion.g>

              {/* Label below card */}
              <motion.text
                x={stage.cx}
                y={stage.cy + H / 2 + 16}
                textAnchor="middle"
                fontSize="9.5"
                letterSpacing="0.08em"
                fill={stage.accent ? '#C96B3A' : '#6B6B63'}
                fontWeight={stage.accent ? '600' : '400'}
                fontFamily="var(--font-inter), system-ui, sans-serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
              >
                {stage.label}
              </motion.text>
            </g>
          )
        })}

        {/* ── Arrow caps on the path segments ───────────────── */}
        {stages.slice(0, -1).map((from, i) => {
          const to = stages[i + 1]
          const mx = (from.cx + to.cx) / 2
          const my = (from.cy + to.cy) / 2
          return (
            <motion.circle
              key={`mid-${i}`}
              cx={mx} cy={my} r={2.5}
              fill="#E5E2D9"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 + i * 0.15 }}
            />
          )
        })}

      </svg>
    </div>
  )
}
