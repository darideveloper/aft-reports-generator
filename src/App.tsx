import { MultiScreenForm } from "./components/MultiScreenForm"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Formulario Multi-Pantalla
          </h1>
          <p className="text-gray-600 text-lg">
            Completa cada pantalla para continuar a la siguiente
          </p>
        </div>
        <MultiScreenForm />
      </div>
    </div>
  )
}

export default App