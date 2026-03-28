// Helper utilities

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateFile = (file) => {
  const validTypes = ['video/', 'audio/'];
  const isValidType = validTypes.some(type => file.type.startsWith(type));
  
  if (!isValidType) {
    return { valid: false, error: 'Tipo de archivo no válido. Sube un video o audio.' };
  }
  
  // Max 500MB
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo es muy grande. Máximo 500MB.' };
  }
  
  return { valid: true };
};

export const generateClipName = (index, format) => {
  return `clip_${(index + 1).toString().padStart(2, '0')}.${format}`;
};

export const canShare = () => {
  return navigator.share && navigator.canShare?.();
};
