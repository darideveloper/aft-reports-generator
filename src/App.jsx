// Assets


// Libs
import clsx from 'clsx';
import { useState } from 'react'

// Components
import Formulario from './components/sections/Formulario';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className={clsx('p-6')}>
           <Formulario />  
    </div>
    </>
  )
}

export default App
