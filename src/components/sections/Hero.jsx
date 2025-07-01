// Components
import Button from '../ui/Butfon'

// Libs
import { clsx } from 'clsx'

export default function Hero() {
  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-screen'
      )}
    >
      <h1>Hero</h1>
      <Button />
    </div>
  )
}
