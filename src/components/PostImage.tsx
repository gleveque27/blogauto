'use client'

import { useState } from 'react'
import { ImageOff, Loader2 } from 'lucide-react'

export function PostImage({ src, alt }: { src: string, alt: string }) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

    return (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border bg-muted flex items-center justify-center">
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            )}

            {status === 'error' ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                    <ImageOff className="h-10 w-10 opacity-50" />
                    <p className="text-sm font-medium">L'image n'a pas pu être chargée.</p>
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline mt-2"
                    >
                        Essayer d'ouvrir l'image directement
                    </a>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setStatus('success')}
                    onError={() => setStatus('error')}
                />
            )}
        </div>
    )
}
