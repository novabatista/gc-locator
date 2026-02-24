import GCLogo from '@/components/GCLogo'

export default function GCHeader(props) {
  /** @var {GC} gc */
  const gc = props.gc
  const {name, config} = gc

  return (
    <header className="flex flex-row items-center" style={{color: config.color.primary}}>
      <span className="text-5xl uniform-black mr-2">GC</span>
      <GCLogo config={config} name={name} location="single" textSize="4xl" className="mr-2" width={64} height={64} />
    </header>
  )
}