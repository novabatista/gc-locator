const getClass = (extraClass) => ([
  'inline-flex',
  'flex-row',
  'items-center',
  'gap-1',
  'px-4',
  'py-2',
  'shadow-sm',
  'rounded-md',
  'text-[var(--background)]',
  'bg-[var(--foreground)]',
  'hover:bg-[var(--foreground-light)]',
  'dark:hover:bg-[var(--foreground-dark)]',
  'focus:outline-none',
  'focus:ring-[var(--foreground)]',
  'focus:ring-offset-2',
  'focus:ring-2',
  'transition-colors',
  'cursor-pointer',
  extraClass,
].join(' '))


export default function Button(props) {
  const Component = props.asLink ? 'a' : 'button'
  return (
    <Component
      type="button"
      {...props}
      className={getClass(props.className)}
    >
      {props.label}
      {props.children}
      {props.icon && <i className={`${props.icon} text-2xl mr-1`} />}
    </Component>
  )
}
