import { create } from 'zustand'
import { clsx } from 'clsx'

// Store de paginación
const usePaginationStore = create((set, get) => ({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 40, // Datos simulados para la demo que cambiaran segun la API
  
  // generacion de cards simuladas, el array de items se cambia por los valores que se obtengan de la API
  allItems: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Descripción del elemento ${i + 1}`
  })),
  
  // Acciones de paginación
  setCurrentPage: (page) => {
    const totalPages = Math.ceil(get().totalItems / get().itemsPerPage)
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page })
    }
  },
  
  nextPage: () => {
    const { currentPage, totalItems, itemsPerPage } = get()
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 })
    }
  },
  
  prevPage: () => {
    const { currentPage } = get()
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 })
    }
  },
  
  // Obtener items de la página actual
  getCurrentItems: () => {
    const { allItems, currentPage, itemsPerPage } = get()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allItems.slice(startIndex, endIndex)
  },
  
  // Info de paginación
  getPageInfo: () => {
    const { currentPage, itemsPerPage, totalItems } = get()
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)
    
    return {
      currentPage,
      totalPages,
      startItem,
      endItem,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }
  }
}))

// Componente Button reutilizable
function Button({ children, onClick, disabled = false, variant = 'primary' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-6',
        'py-3',
        'rounded-lg',
        'font-semibold',
        'text-sm',
        'transition-all',
        'duration-200',
        'transform',
        'border-2',
        'active:scale-95',
        {
          'bg-blue': variant === 'primary' && !disabled,
          'border-blue': variant === 'primary' && !disabled,
          'text-white': variant === 'primary' && !disabled,
          'hover:bg-blue-600': variant === 'primary' && !disabled,
          'hover:border-blue-600': variant === 'primary' && !disabled,
          'shadow-md': variant === 'primary' && !disabled,
          'hover:shadow-lg': variant === 'primary' && !disabled,
          'bg-gray-300': disabled,
          'border-gray-300': disabled,
          'text-gray-500': disabled,
          'cursor-not-allowed': disabled,
          'bg-white': variant === 'secondary' && !disabled,
          'border-blue': variant === 'secondary' && !disabled,
          'text-blue': variant === 'secondary' && !disabled,
          'hover:bg-blue': variant === 'secondary' && !disabled,
          'hover:text-white': variant === 'secondary' && !disabled,
          'shadow-md': variant === 'secondary' && !disabled,
          'hover:shadow-lg': variant === 'secondary' && !disabled,
        }
      )}
    >
      {children}
    </button>
  )
}

// Componente Info de paginación
function Info() {
  const getPageInfo = usePaginationStore(state => state.getPageInfo)
  const pageInfo = getPageInfo()
  
  return (
    <div className={clsx(
      'text-center',
      'text-gray-700',
      'mb-4'
    )}>
      <p className="text-xl">
        Página {pageInfo.currentPage} de {pageInfo.totalPages}
      </p>
      
      <p>
        Mostrando {pageInfo.startItem} - {pageInfo.endItem} de {pageInfo.totalItems} preguntas
      </p>
    </div>
  )
}

// Componente principal Formulario
export default function Formulario() {
  const { 
    currentPage,
    getCurrentItems,
    getPageInfo,
    setCurrentPage,
    nextPage,
    prevPage
  } = usePaginationStore()
  
  const currentItems = getCurrentItems()
  const pageInfo = getPageInfo()
  
  return (
    <div className={clsx(
      'max-w-6xl',
      'mx-auto',
      'p-4',
      'sm:p-6',
      'lg:p-8',
      'bg-white',
      'rounded-lg',
      'shadow-lg'
    )}>
      <h2 className={clsx(
        'text-2xl',
        'sm:text-3xl',
        'font-bold',
        'text-center',
        'mb-6',
        'sm:mb-8',
        'text-blue'
      )}>
        Sistema de Paginación
      </h2>
      
      {/* Información de paginación */}
      <Info />
      
      {/* Lista de elementos */}
      <div className={clsx(
        'grid',
        'gap-3',
        'sm:gap-4',
        'mb-6',
        'sm:mb-8'
      )}>
        {currentItems.map(item => (
          <div key={item.id} className={clsx(
            'p-3',
            'sm:p-4',
            'border',
            'border-gray-200',
            'rounded-lg',
            'bg-gray-50'
          )}>
            <h3 className={clsx(
              'font-semibold',
              'text-base',
              'sm:text-lg',
              'text-blue',
              'mb-1'
            )}>{item.name}</h3>
            <p className={clsx(
              'text-sm',
              'sm:text-base',
              'text-gray-600'
            )}>{item.description}</p>
          </div>
        ))}
      </div>
      
      {/* Controles de paginación */}
      <div className={clsx(
        'flex',
        'flex-col',
        'sm:flex-row',
        'justify-center',
        'items-center',
        'gap-4',
        'sm:gap-6',
        'bg-gray-50',
        'p-3',
        'sm:p-4',
        'rounded-lg'
      )}>
        {/* Botón Anterior */}
        <Button 
          onClick={prevPage}
          disabled={!pageInfo.hasPrev}
          variant="secondary"
        >
          <span className={clsx(
            'flex',
            'items-center',
            'gap-2'
          )}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">Ant</span>
          </span>
        </Button>
        
        {/* Números de página */}
        <div className={clsx(
          'flex',
          'gap-1',
          'flex-wrap',
          'justify-center'
        )}>
          {Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={clsx(
                'w-10',
                'h-10',
                'sm:w-12',
                'sm:h-12',
                'rounded-lg',
                'font-semibold',
                'text-xs',
                'sm:text-sm',
                'transition-all',
                'duration-200',
                'border-2',
                'active:scale-95',
                {
                  'bg-blue': page === currentPage,
                  'border-blue': page === currentPage,
                  'text-white': page === currentPage,
                  'shadow-md': page === currentPage,
                  'bg-white': page !== currentPage,
                  'border-gray-300': page !== currentPage,
                  'text-gray-700': page !== currentPage,
                  'hover:border-blue': page !== currentPage,
                  'hover:text-blue': page !== currentPage,
                  'hover:shadow-md': page !== currentPage,
                }
              )}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Botón Siguiente */}
        <Button 
          onClick={nextPage}
          disabled={!pageInfo.hasNext}
        >
          <span className={clsx(
            'flex',
            'items-center',
            'gap-2'
          )}>
            <span className="hidden sm:inline">Siguiente</span>
            <span className="sm:hidden">Sig</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
      </div>
    </div>
  )
}
