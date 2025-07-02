// Components
import Button from '../ui/Button'
import Formulario from '../sections/Formulario'

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
           <Formulario />  

    </div>
  )
}
