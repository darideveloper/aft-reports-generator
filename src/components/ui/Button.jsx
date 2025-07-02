// Libs
import { clsx } from 'clsx'

export default function Button() {
  return (
    <button
      className={clsx(
        'text-white hover:bg-green',
        'p-2',
        'rounded-md',
        'bg-blue',
        'text-3xl'
      )}
    >
      Click me
    </button>
  )
}
