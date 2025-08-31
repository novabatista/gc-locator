
export default function Button(props) {
  const Component = props.asLink ? 'a' : 'button'
  return (
    <Component
      className="inline-flex flex-row items-center gap-1 px-4 py-2 text-white bg-gray-800 border-gray-900 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 transition-colors cursor-pointer"
      type="button"
      {...props}
    >
      {props.label}

      {props.children}
    </Component>
  )
}