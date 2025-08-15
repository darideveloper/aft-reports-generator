import { MultiScreenForm } from "./components/MultiScreenForm"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-Screen Form
          </h1>
          <p className="text-gray-600 text-lg">
            Complete each screen to proceed to the next one
          </p>
        </div>
        <MultiScreenForm />
      </div>
    </div>
  )
}

export default App