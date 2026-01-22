import { useState, useRef, useCallback } from 'react'

/**
 * Vérifie si l'hostname est une adresse IP locale (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
 * @param {string} hostname - Hostname à vérifier
 * @returns {boolean} - true si c'est une IP locale
 */
const isLocalIP = (hostname) => {
  // IPv4 local patterns
  const localIPPatterns = [
    /^192\.168\./,           // 192.168.0.0/16
    /^10\./,                 // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^127\./,                // 127.0.0.0/8 (localhost)
    /^169\.254\./,           // 169.254.0.0/16 (link-local)
    /^localhost$/i,          // localhost
    /^::1$/,                 // IPv6 localhost
    /^fe80:/i                // IPv6 link-local
  ]
  
  return localIPPatterns.some(pattern => pattern.test(hostname))
}

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
 * @returns {Object} { isRecording, startRecording, stopRecording, audioBlob, error, requestMicrophoneAccess, hasMicrophoneAccess }
 */
export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  /**
   * Gère les erreurs de microphone de manière centralisée
   */
  const handleMicrophoneError = useCallback((err) => {
    let errorMessage = 'Impossible d\'accéder au microphone.'
    
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMessage = 'Accès au microphone refusé. Veuillez autoriser l\'accès au microphone dans les paramètres de votre navigateur et réessayer.'
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      errorMessage = 'Aucun microphone détecté. Veuillez connecter un microphone et réessayer.'
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      errorMessage = 'Le microphone est utilisé par une autre application. Veuillez fermer les autres applications utilisant le microphone et réessayer.'
    } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      errorMessage = 'Les paramètres audio demandés ne sont pas supportés par votre appareil.'
    } else if (err.name === 'SecurityError') {
      const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      if (!isSecure) {
        errorMessage = 'Erreur de sécurité : Chrome et les navigateurs modernes exigent HTTPS pour accéder au microphone. Veuillez utiliser HTTPS ou tester en localhost (http://localhost).'
      } else {
        errorMessage = 'Erreur de sécurité. Votre navigateur bloque l\'accès au microphone. Vérifiez les paramètres de sécurité de votre navigateur.'
      }
    } else if (err.name === 'TypeError') {
      errorMessage = 'Erreur de configuration. Votre navigateur ne supporte peut-être pas cette fonctionnalité.'
    } else {
      errorMessage = `Erreur: ${err.message || 'Impossible d\'accéder au microphone. Veuillez vérifier les permissions dans les paramètres de votre navigateur.'}`
    }
    
    // Message supplémentaire pour mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
      errorMessage += ' Sur mobile, allez dans les paramètres de Chrome > Paramètres du site > Microphone et autorisez l\'accès.'
    }
    
    setError(errorMessage)
  }, [])

  /**
   * Demande explicitement l'accès au microphone
   * @returns {Promise<boolean>} - true si l'accès est accordé, false sinon
   */
  const requestMicrophoneAccess = useCallback(async () => {
    try {
      setError(null)

      // Vérifier que l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = 'Votre navigateur ne supporte pas l\'enregistrement audio. Veuillez utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge).'
        setError(errorMsg)
        return false
      }

      // Vérifier si on est en HTTPS (requis sur mobile sauf localhost)
      // Chrome et les navigateurs modernes bloquent l'accès au microphone en HTTP
      // Seul localhost/127.0.0.1 est autorisé en HTTP, pas les IPs locales (192.168.x.x, etc.)
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      const isLocalIPAddress = isLocalIP(location.hostname)
      const isSecureContext = window.isSecureContext || location.protocol === 'https:' || isLocalhost
      
      if (!isSecureContext) {
        let errorMsg = '🔒 Chrome bloque l\'accès au microphone en HTTP.'
        
        if (isLocalIPAddress && !isLocalhost) {
          // Cas spécifique : accès via IP locale (ex: 192.168.x.x depuis mobile)
          errorMsg += ' Même via l\'IP de votre PC, Chrome exige HTTPS pour le microphone.\n\n'
          errorMsg += '💡 Solutions :\n'
          errorMsg += '1) Utilisez un tunnel HTTPS (recommandé pour mobile) :\n'
          errorMsg += '   • ngrok : `ngrok http 3000` puis utilisez l\'URL HTTPS fournie\n'
          errorMsg += '   • Cloudflare Tunnel : `cloudflared tunnel --url http://localhost:3000`\n'
          errorMsg += '   • localtunnel : `npx localtunnel --port 3000`\n\n'
          errorMsg += '2) Configurez HTTPS local avec certificat auto-signé\n'
          errorMsg += '3) Testez uniquement sur PC avec http://localhost'
        } else {
          errorMsg += ' L\'accès au microphone nécessite HTTPS (ou localhost pour le développement).'
        }
        
        setError(errorMsg)
        return false
      }

      // Détecter si on est sur mobile (une seule fois)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Vérifier l'état de la permission si l'API est disponible
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' })
          
          if (result.state === 'denied') {
            const errorMsg = isMobile 
              ? 'L\'accès au microphone est refusé. Sur mobile, allez dans Chrome > Menu (⋮) > Paramètres > Paramètres du site > Microphone et autorisez l\'accès pour ce site.'
              : 'L\'accès au microphone est refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.'
            setError(errorMsg)
            setHasMicrophoneAccess(false)
            return false
          }
        } catch (permError) {
          // L'API permissions.query peut ne pas être supportée, on continue
        }
      }
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      // Marquer que l'accès a été accordé
      setHasMicrophoneAccess(true)
      setError(null) // Effacer toute erreur
      
      // Arrêter le stream immédiatement (on voulait juste demander la permission)
      // Le stream sera recréé lors de startRecording
      stream.getTracks().forEach(track => {
        track.stop()
      })
      
      return true
    } catch (err) {
      setHasMicrophoneAccess(false)
      handleMicrophoneError(err)
      return false
    }
  }, [handleMicrophoneError])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      chunksRef.current = []

      // Vérifier que l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = 'Votre navigateur ne supporte pas l\'enregistrement audio. Veuillez utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge).'
        setError(errorMsg)
        return
      }

      // Vérifier si on est en HTTPS (requis sur mobile sauf localhost)
      // Chrome et les navigateurs modernes bloquent l'accès au microphone en HTTP
      // Seul localhost/127.0.0.1 est autorisé en HTTP, pas les IPs locales (192.168.x.x, etc.)
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      const isLocalIPAddress = isLocalIP(location.hostname)
      const isSecureContext = window.isSecureContext || location.protocol === 'https:' || isLocalhost
      
      if (!isSecureContext) {
        let errorMsg = '🔒 Chrome bloque l\'accès au microphone en HTTP.'
        
        if (isLocalIPAddress && !isLocalhost) {
          // Cas spécifique : accès via IP locale (ex: 192.168.x.x depuis mobile)
          errorMsg += ' Même via l\'IP de votre PC, Chrome exige HTTPS pour le microphone.\n\n'
          errorMsg += '💡 Solutions :\n'
          errorMsg += '1) Utilisez un tunnel HTTPS (recommandé pour mobile) :\n'
          errorMsg += '   • ngrok : `ngrok http 3000` puis utilisez l\'URL HTTPS fournie\n'
          errorMsg += '   • Cloudflare Tunnel : `cloudflared tunnel --url http://localhost:3000`\n'
          errorMsg += '   • localtunnel : `npx localtunnel --port 3000`\n\n'
          errorMsg += '2) Configurez HTTPS local avec certificat auto-signé\n'
          errorMsg += '3) Testez uniquement sur PC avec http://localhost'
        } else {
          errorMsg += ' L\'accès au microphone nécessite HTTPS (ou localhost pour le développement).'
        }
        
        setError(errorMsg)
        return
      }

      // Vérifier les permissions si l'API est disponible
      let permissionStatus = 'prompt'
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' })
          permissionStatus = result.state
        } catch (permError) {
          // L'API permissions.query peut ne pas être supportée sur tous les navigateurs
        }
      }

      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      // Stocker le stream et marquer que l'accès est accordé
      streamRef.current = stream
      setHasMicrophoneAccess(true)
      setError(null) // Effacer toute erreur précédente
      
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
          break
        }
      }
      
      // Si aucun format n'est supporté (très rare), utiliser le format par défaut
      if (!supportedType) {
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
            finalBlob = await convertToWav(originalBlob)
            finalType = 'audio/wav'
          } catch (conversionError) {
            console.error('Erreur lors de la conversion en WAV:', conversionError)
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
        
        // Arrêter tous les tracks du stream pour libérer le micro
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        } else {
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setIsRecording(false)
      setHasMicrophoneAccess(false)
      handleMicrophoneError(err)
    }
  }, [handleMicrophoneError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      const recorder = mediaRecorderRef.current.recorder || mediaRecorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop()
      }
      setIsRecording(false)
      
      // Libérer le stream si il existe
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [isRecording])

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    error,
    setError,
    requestMicrophoneAccess,
    hasMicrophoneAccess
  }
}
