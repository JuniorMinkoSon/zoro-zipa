import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Headphones, QrCode, ScanLine } from 'lucide-react'
import { Modal } from './Modal'
import { useArtworks } from '../api/hooks'

interface QRScannerProps {
  open: boolean
  onClose: () => void
}

/**
 * QR artwork scanner: opens the device camera and accepts an artwork code
 * (ZZ-<id>) to open the artwork's story, artist and audio-guide page.
 */
export function QRScanner({ open, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const [code, setCode] = useState('')
  const [notFound, setNotFound] = useState(false)
  const { data: artworks } = useArtworks()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    let stream: MediaStream | null = null
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(() => setCameraError(true))
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [open])

  const submitCode = () => {
    const id = Number(code.replace(/^ZZ-/i, ''))
    const artwork = artworks?.find((a) => a.id === id)
    if (artwork) {
      onClose()
      navigate(`/oeuvres/${artwork.id}`)
    } else {
      setNotFound(true)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Scanner une œuvre">
      <div className="space-y-5">
        <div className="relative aspect-video overflow-hidden bg-ink">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-ivory/60">
              <Camera size={28} />
              <p className="text-sm">Caméra indisponible — saisissez le code.</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <ScanLine size={40} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse text-gold" />
            </>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.25em] text-ink/50">
            Code de l'œuvre (ex. ZZ-1)
          </label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setNotFound(false)
              }}
              placeholder="ZZ-…"
              className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <button
              onClick={submitCode}
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
            >
              <QrCode size={15} /> Ouvrir
            </button>
          </div>
          {notFound && (
            <p className="mt-2 text-xs text-red-600">Aucune œuvre pour ce code.</p>
          )}
        </div>

        <p className="flex items-center gap-2 text-xs text-ink/50">
          <Headphones size={14} className="text-gold" />
          Chaque œuvre scannée révèle son histoire, son artiste et son audio-guide.
        </p>
      </div>
    </Modal>
  )
}
