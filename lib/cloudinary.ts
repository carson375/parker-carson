const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'parker-carson'

export const cloudinaryLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  // If it's already a full URL, don't modify it
  if (src.startsWith('http')) return src

  // Remove leading slash if it exists
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src

  // Encode the path segments (handles spaces, special characters)
  // We split by / to ensure we don't encode the folder slashes
  const escapedSrc = cleanSrc
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/')

  // Example: https://res.cloudinary.com/parker-carson/image/upload/w_1000,q_auto,f_auto/photography/Paris2022/Bridge.JPG
  const params = [
    `w_${width}`,
    'q_auto',
    'f_auto',
    quality ? `q_${quality}` : '',
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${escapedSrc}`
}
