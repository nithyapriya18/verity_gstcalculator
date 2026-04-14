import Link from 'next/link'
import { siteConfig } from '@/config'

interface LogoMarkProps {
  size?: number
}

/**
 * VS mark — the V's bottom vertex becomes the start of the S.
 * The left arm of the V flows continuously into the S curves.
 * The right arm of the V is a second stroke completing the V shape.
 *
 * Reading it: V at top (left arm + right arm meeting at a point),
 * then a fluid S dropping from that point.
 */
export function LogoMark({ size = 36 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-label="Verity Studios mark"
    >
      {/* Warm rounded square background */}
      <rect width="44" height="44" rx="11" fill="#C96B3A" />

      {/*
        V left arm + S body — one continuous stroke:
          1.  M 9,7        → start at top-left
          2.  L 22,20      → diagonal down-right to V point
          3.  C 33,20      → S top bowl: pull right from V point
              38,28
              22,32        → back to center axis, lower
          4.  C 6,36       → S bottom bowl: pull left
              10,40
              22,38        → back to center axis, base of S
      */}
      <path
        d="M 9,7 L 22,20 C 33,20 38,28 22,32 C 6,36 10,40 22,38"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* V right arm — separate stroke sharing the same vertex */}
      <path
        d="M 35,7 L 22,20"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/*
        Small horizontal serifs to anchor the S ends and
        make it unmistakably read as S at small sizes.
      */}
      {/* Top S serif (above/left of V point — sits like a hat on the S) */}
      <path
        d="M 16,38 L 28,38"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  )
}

interface LogoProps {
  showName?: boolean
  size?: number
  className?: string
  href?: string
  nameClassName?: string
}

export function Logo({
  showName = true,
  size = 36,
  className = '',
  href = '/',
  nameClassName = '',
}: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoMark size={size} />
      {showName && (
        <span
          className={`font-display font-semibold text-xl tracking-tight text-text-primary group-hover:text-accent transition-colors duration-200 ${nameClassName}`}
        >
          {siteConfig.name}
        </span>
      )}
    </span>
  )

  return (
    <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
      {inner}
    </Link>
  )
}
