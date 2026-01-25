export const BreakpointEnum = {
  base: 'base',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xl2: '2xl',
}

export const BreakpointEnumSize = {
  [BreakpointEnum.base]: 0,
  [BreakpointEnum.sm]: 640,
  [BreakpointEnum.md]: 768,
  [BreakpointEnum.lg]: 1024,
  [BreakpointEnum.xl]: 1280,
  [BreakpointEnum.xl2]: 1536,
}

function getBreakpointForWidth(windowWidth) {
  let curBreakpointLabel = BreakpointEnum.base
  let curBreakpointSize = 0
  let biggestBreakpointValue = 0

  for (const [breakpoint, size] of Object.entries(BreakpointEnumSize)) {
    if (size > biggestBreakpointValue && windowWidth >= size) {
      biggestBreakpointValue = size
      curBreakpointLabel = breakpoint
      curBreakpointSize = size
    }
  }

  return {
    label: curBreakpointLabel,
    size: curBreakpointSize,
  }
}

export default function useBreakpoint() {
  let current = typeof window !== 'undefined'
    ? getBreakpointForWidth(window.innerWidth)
    : {label: BreakpointEnum.base, size: 0}

  let is = {
    [BreakpointEnum.base]: false,
    [BreakpointEnum.sm]: false,
    [BreakpointEnum.md]: false,
    [BreakpointEnum.lg]: false,
    [BreakpointEnum.xl]: false,
    [BreakpointEnum.xl2]: false,
  }
  is[current.label] = true

  function getCurrentBreakpoint() {
    return current
  }

  function updateBreakpoint() {
    if (typeof window === 'undefined') return

    const bp = getBreakpointForWidth(window.innerWidth)
    current = bp

    is = {
      [BreakpointEnum.base]: false,
      [BreakpointEnum.sm]: false,
      [BreakpointEnum.md]: false,
      [BreakpointEnum.lg]: false,
      [BreakpointEnum.xl]: false,
      [BreakpointEnum.xl2]: false,
      [bp.label]: true,
    }
  }

  function matcher(entries) {
    const breakpointOrder = [
      BreakpointEnum.base,
      BreakpointEnum.sm,
      BreakpointEnum.md,
      BreakpointEnum.lg,
      BreakpointEnum.xl,
      BreakpointEnum.xl2,
    ]

    const currentIndex = breakpointOrder.indexOf(current.label)
    let result = entries?.[BreakpointEnum.base]

    for (let i = 0; i <= currentIndex; i++) {
      const bp = breakpointOrder[i]
      if (entries[bp] !== undefined) {
        result = entries[bp]
      }
    }

    return result
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateBreakpoint)
  }

  return {
    is,
    current,
    getCurrentBreakpoint,
    matcher,
  }
}