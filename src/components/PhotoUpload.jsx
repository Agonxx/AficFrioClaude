/**
 * Componente de Upload de Fotos (Mock)
 * Simula upload de fotos para a OS
 */
import { useState, useRef } from 'react'
import { Button } from './ui'

export function PhotoUpload({ photos = [], onChange, maxPhotos = 5 }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Verifica limite de fotos
    if (photos.length + files.length > maxPhotos) {
      alert(`Máximo de ${maxPhotos} fotos permitidas`)
      return
    }

    setUploading(true)

    // Simula upload processando cada arquivo
    const newPhotos = []
    for (const file of files) {
      // Verifica se é imagem
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Simula delay de upload
      await new Promise(resolve => setTimeout(resolve, 500))

      // Cria URL local para preview (mock)
      const photoData = {
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      }
      newPhotos.push(photoData)
    }

    onChange([...photos, ...newPhotos])
    setUploading(false)

    // Limpa o input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId)
    onChange(updatedPhotos)
  }

  return (
    <div className="space-y-4">
      {/* Preview das fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemove(photo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão de upload */}
      {photos.length < maxPhotos && (
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`
              flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg
              cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {uploading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-gray-600">Enviando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Adicionar fotos</span>
              </>
            )}
          </label>
          <span className="text-xs text-gray-500">
            {photos.length}/{maxPhotos} fotos
          </span>
        </div>
      )}
    </div>
  )
}
