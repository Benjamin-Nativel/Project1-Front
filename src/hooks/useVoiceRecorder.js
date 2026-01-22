import { useState, useRef, useCallback } from 'react'

/**
 * Convertit un blob audio en format WAV (supporté par le backend)
 * @param {Blob} audioBlob - Blob audio à convertir
 * @returns {Promise<Blob>} - Blob WAV
 */
const convertToWav = async (audioBlob) => {
  try {
    // Créer un contexte audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Décoder le blob audio
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Convertir en WAV
    const wav = audioBufferToWav(audioBuffer)
    const wavBlob = new Blob([wav], { type: 'audio/wav' })
    
    console.log('🔄 Conversion audio:', {
      original: audioBlob.type,
      converted: 'audio/wav',
      originalSize: audioBlob.size,
      convertedSize: wavBlob.size
    })
    
    return wavBlob
  } catch (error) {
    console.error('Erreur lors de la conversion en WAV:', error)
    throw new Error('Impossible de convertir l\'audio en WAV')
  }
}

/**
 * Convertit un AudioBuffer en format WAV
 * @param {AudioBuffer} audioBuffer - Buffer audio à convertir
 * @returns {ArrayBuffer} - Données WAV
 */
const audioBufferToWav = (audioBuffer) => {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16
  
  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample
  
  const length = audioBuffer.length * numChannels * bytesPerSample + 44
  const buffer = new ArrayBuffer(length)
  const view = new DataView(buffer)
  
  // Écrire l'en-tête WAV
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, length - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // Taille du format
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(36, 'data')
  view.setUint32(40, length - 44, true)
  
  // Écrire les données audio
  let offset = 44
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }
  
  return buffer
}

/**
 * Hook personnalisé pour l'enregistrement vocal
 * @returns {Object} { isRecording, startRecording, stopRecording, audioBlob, error }
 */
export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // On accepte TOUS les formats supportés par MediaRecorder
      // Ils seront automatiquement convertis en WAV (supporté par le backend) si nécessaire
      const mimeTypesToTest = [
        // Formats natifs supportés par le backend (pas besoin de conversion)
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/wav',
        'audio/x-wav',
        // Formats qui nécessiteront une conversion en WAV
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/m4a',
        'audio/mpeg',
        'audio/mp3'
      ]
      
      // Trouver le premier format supporté par MediaRecorder
      let supportedType = null
      for (const mimeType of mimeTypesToTest) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedType = mimeType
          console.log(`✅ Format supporté trouvé: ${mimeType}`)
          break
        }
      }
      
      // Si aucun format n'est supporté (très rare), utiliser le format par défaut
      if (!supportedType) {
        console.warn('⚠️ Aucun format MIME spécifique supporté, utilisation du format par défaut du navigateur')
        supportedType = undefined // Laisser MediaRecorder choisir
      }
      
      const mediaRecorder = new MediaRecorder(stream, supportedType ? { mimeType: supportedType } : {})
      
      // Stocker le type supporté pour l'utiliser plus tard
      mediaRecorderRef.current = {
        recorder: mediaRecorder,
        mimeType: supportedType
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const storedMimeType = mediaRecorderRef.current?.mimeType
        
        // Créer le blob avec le type original
        const originalBlob = new Blob(chunksRef.current, { 
          type: storedMimeType || 'audio/webm' 
        })
        
        // Vérifier si le format est déjà supporté par le backend
        const isNativeSupported = storedMimeType && (
          storedMimeType.includes('audio/ogg') ||
          storedMimeType.includes('audio/wav')
        )
        
        let finalBlob = originalBlob
        let finalType = storedMimeType || 'audio/webm'
        
        // Si le format n'est pas supporté nativement, convertir en WAV
        if (!isNativeSupported) {
          try {
            console.log('🔄 Conversion de l\'audio en WAV pour compatibilité backend...')
            finalBlob = await convertToWav(originalBlob)
            finalType = 'audio/wav'
            console.log('✅ Conversion réussie en WAV')
          } catch (conversionError) {
            console.error('❌ Erreur lors de la conversion en WAV:', conversionError)
            setError('Erreur lors de la conversion audio. Veuillez réessayer.')
            stream.getTracks().forEach(track => track.stop())
            return
          }
        } else {
          // Normaliser les types natifs supportés
          if (finalType.includes('audio/ogg')) {
            finalType = 'audio/ogg'
          } else if (finalType.includes('audio/wav') || finalType === 'audio/x-wav') {
            finalType = 'audio/wav'
          }
        }
        
        setAudioBlob(finalBlob)
        
        console.log('🎤 Enregistrement terminé:', {
          originalType: storedMimeType || 'audio/webm',
          finalType: finalType,
          originalSize: originalBlob.size,
          finalSize: finalBlob.size,
          converted: !isNativeSupported ? '✅ Converti en WAV' : '✅ Format natif supporté',
          chunks: chunksRef.current.length
        })
        
        // Arrêter tous les tracks du stream pour libérer le micro
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', err)
      setError('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.')
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      const recorder = mediaRecorderRef.current.recorder || mediaRecorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop()
      }
      setIsRecording(false)
    }
  }, [isRecording])

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    error,
    setError
  }
}
