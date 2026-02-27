export default function Squares({
  containerWidth=540,
  width=100,
  height=60,
  bottom=-5,
  x='default',
  y='default',
  className,
}) {
  const background = '#95746b'
  // transform: 'perspective(600px) rotate(-24deg) skewY(24deg)'

  function calcRatio(base, ratio=100){
    const r = base / 100 * ratio
    return `${r}px`
  }
  const w = (ratio) => calcRatio(width, ratio)
  const h = (ratio) => calcRatio(height, ratio)
  const l = (position, ratio=-20) => {
    const baseLeft = width * (position - 1)
    const adjustment = baseLeft / 100 * ratio
    return `${baseLeft + adjustment}px`
  }

  return <>
    <div id="s-root" className={className} style={{
      position: 'relative',
      width: containerWidth,
      height: height,
      overflow: 'hidden',
      transform: `rotateX(${x==='default' ? 0 : 180}deg) rotateY(${y==='default' ? 0 : 180}deg)`,
    }}>
      <div style={{
        position: 'relative',
        height: height,
        left: 100,
        bottom,
        transform: 'rotate(-30deg) skewY(30deg)',
        opacity: 0.7,
      }}>

        <div id="s1" className="border border-accent" style={{
          position: 'absolute',
          zIndex: 1,
          width: w(),
          height: h(60),
          left: '0',
          bottom: 0,
        }} />

        <div id="s2" className="" style={{
          position: 'absolute',
          zIndex: 2,
          width: w(),
          height: h(80),
          left: l(2, -20),
          bottom: 0,
          background,
          opacity: 0.4,
        }} />

        <div id="s3" className="border border-accent" style={{
          position: 'absolute',
          zIndex: 2,
          width: w(),
          height: h(100),
          left: l(3, -40),
          bottom: 0,
          background: 'transparent',
        }} />

        <div id="s4" className="bg-accent" style={{
          position: 'absolute',
          zIndex: 3,
          width: w(),
          height: h(30),
          left: l(4, -35),
          bottom: 0,
        }} />

        <div id="s5" className="border border-accent" style={{
          position: 'absolute',
          zIndex: 2,
          width: w(),
          height: h(60),
          left: l(5, -40),
          bottom: 0,
        }} />

        <div id="s6" style={{
          position: 'absolute',
          zIndex: 1,
          width: w(),
          height: h(80),
          left: l(6, -39),
          bottom: 0,
          background,
          opacity: 0.9,
        }} />

      </div>
    </div>
  </>
}