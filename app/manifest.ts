import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon1.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icon2.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ]
    
}
}