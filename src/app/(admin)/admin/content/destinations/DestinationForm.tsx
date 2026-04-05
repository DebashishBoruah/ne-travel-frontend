'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { NE_STATES } from '@/types'
import { Info, Search } from 'lucide-react'
import { TextField, Select, Button, ImageAttacher, TagInput } from '@/components/admin/ui'
import type { SelectOption } from '@/components/admin/ui'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })

function MapRecenter({ coords }: { coords: [number, number] }) {
  const { useMap } = require('react-leaflet')
  const map = useMap()
  if (map) map.setView(coords, 13)
  return null
}

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Waterfall', label: 'Waterfall' },
  { value: 'Hill Station', label: 'Hill Station' },
  { value: 'Temple', label: 'Temple' },
  { value: 'Trek', label: 'Trek' },
  { value: 'Cafe', label: 'Café' },
  { value: 'Lake', label: 'Lake' },
  { value: 'Wildlife', label: 'Wildlife Sanctuary' },
  { value: 'Hidden Gem', label: 'Hidden Gem' },
]

const STATE_OPTIONS: SelectOption[] = NE_STATES.map(s => ({ value: s, label: s }))

const DIFFICULTY_OPTIONS: SelectOption[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Hard', label: 'Hard' },
]

interface DestinationFormProps {
  initialData?: Record<string, unknown>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function DestinationForm({ initialData, onSuccess, onCancel }: DestinationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!initialData?.id

  // Hero image
  const [heroFiles, setHeroFiles] = useState<File[]>([])

  // Gallery
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])

  // Tags
  const [tags, setTags] = useState<string[]>((initialData?.tags as string[]) || [])

  // Location
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const geo = initialData?.location_geojson ?? initialData?.map_coordinates
    if (!geo) return null
    return typeof geo === 'string' ? JSON.parse(geo) : (geo as { lat: number; lng: number })
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'destinations')
    const res = await apiFetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
      setSearchResults(await res.json())
    } catch {
      /* silent */
    } finally {
      setSearching(false)
    }
  }

  const selectLocation = (r: { lat: string; lon: string; display_name: string }) => {
    setCoords({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) })
    setSearchResults([])
    setSearchQuery(r.display_name)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)

    try {
      let heroUrl = (initialData?.hero_image as string) || ''
      if (heroFiles.length) {
        heroUrl = await uploadFile(heroFiles[0])
      } else if (!isEdit) {
        throw new Error('Hero image is required.')
      }

      const uploadedGallery = await Promise.all(galleryFiles.map(uploadFile))
      const existingMedias = (initialData?.medias as string[]) || []

      const payload = {
        title: fd.get('title'),
        state: fd.get('state'),
        district: fd.get('district'),
        slug: fd.get('slug') || fd.get('title')?.toString().toLowerCase().replace(/\s+/g, '-'),
        hero_image: heroUrl,
        description: fd.get('description'),
        short_description: fd.get('short_description'),
        category: fd.get('category'),
        address: fd.get('address'),
        region: fd.get('region'),
        best_time_to_visit: fd.get('best_time_to_visit'),
        entry_fee: fd.get('entry_fee') ? parseFloat(fd.get('entry_fee') as string) : null,
        opening_hours: fd.get('opening_hours'),
        duration: fd.get('duration'),
        difficulty: fd.get('difficulty'),
        weather_info: fd.get('weather_info'),
        safety_tips: fd.get('safety_tips'),
        medias: [...existingMedias, ...uploadedGallery],
        videos: (fd.get('videos') as string)?.split(',').map(v => v.trim()).filter(Boolean) || [],
        location_geojson: coords,
        status: fd.get('status') || 'draft',
        meta_title: fd.get('meta_title'),
        meta_description: fd.get('meta_description'),
        keywords: (fd.get('keywords') as string)?.split(',').map(k => k.trim()).filter(Boolean) || [],
        tags,
      }

      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit ? `/api/content/destinations/${initialData!.id}` : '/api/content/destinations'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        onSuccess?.()
      } else {
        setError(json.error || 'Failed to save destination')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const MapContainerAny = MapContainer as any
  const TileLayerAny = TileLayer as any
  const MarkerAny = Marker as any
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.25rem' }}>
          <Info size={16} /> {error}
        </div>
      )}

      {/* ── Destination Identity ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Destination Identity</div>
        <div className="admin-form-section-body">
          <TextField
            label="Place Name"
            name="title"
            required
            defaultValue={initialData?.title as string}
            placeholder="e.g. Dawki River"
          />

          <div className="admin-form-row admin-form-row--2">
            <Select
              label="Category"
              name="category"
              options={CATEGORY_OPTIONS}
              placeholder="Select Category"
              defaultValue={initialData?.category as string}
            />
            <Select
              label="State"
              name="state"
              required
              options={STATE_OPTIONS}
              placeholder="Select State"
              defaultValue={initialData?.state as string}
            />
          </div>

          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Region"
              name="region"
              hint="State → District → Village"
              defaultValue={initialData?.region as string}
              placeholder="e.g. Meghalaya, West Jaintia Hills"
            />
            <TextField
              label="Address"
              name="address"
              defaultValue={initialData?.address as string}
              placeholder="Nearby landmark"
            />
          </div>
        </div>
      </div>

      {/* ── Experience & Logistics ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Experience &amp; Logistics</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--3">
            <TextField
              label="Best Time to Visit"
              name="best_time_to_visit"
              defaultValue={(initialData?.best_time_to_visit ?? initialData?.best_season) as string}
              placeholder="Oct – Mar"
            />
            <TextField
              label="Entry Fee (₹)"
              name="entry_fee"
              type="number"
              defaultValue={initialData?.entry_fee as string}
              placeholder="0 for Free"
            />
            <Select
              label="Difficulty"
              name="difficulty"
              hint="For treks"
              options={DIFFICULTY_OPTIONS}
              placeholder="N/A"
              defaultValue={initialData?.difficulty as string}
            />
          </div>

          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Short Description"
              hint="For cards"
              name="short_description"
              multiline
              rows={3}
              defaultValue={initialData?.short_description as string}
              placeholder="2–3 lines about this place…"
            />
            <TextField
              label="Detailed Description"
              hint="Page content"
              name="description"
              multiline
              rows={3}
              defaultValue={initialData?.description as string}
              placeholder="Describe the immersive experience…"
            />
          </div>

          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Weather Info"
              name="weather_info"
              multiline
              rows={2}
              defaultValue={initialData?.weather_info as string}
            />
            <TextField
              label="Safety Tips"
              name="safety_tips"
              multiline
              rows={2}
              defaultValue={initialData?.safety_tips as string}
            />
          </div>
        </div>
      </div>

      {/* ── Media ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Media</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <ImageAttacher
              label="Hero Image"
              required={!isEdit}
              existingUrl={initialData?.hero_image as string}
              files={heroFiles}
              onChange={setHeroFiles}
            />
            <ImageAttacher
              label="Gallery"
              multiple
              files={galleryFiles}
              onChange={setGalleryFiles}
              hint="Optional extra photos"
            />
          </div>

          <TextField
            label="Video Links"
            hint="Comma-separated"
            name="videos"
            defaultValue={(initialData?.videos as string[])?.join(', ')}
            placeholder="https://youtube.com/…"
          />
        </div>
      </div>

      {/* ── Location ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Location</div>
        <div className="admin-form-section-body">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                className="admin-input"
                style={{ paddingLeft: '2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchLocation() } }}
                placeholder="Search location…"
              />
            </div>
            <Button type="button" onClick={handleSearchLocation} loading={searching}>
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid var(--admin-border-standard)',
              borderRadius: 'var(--admin-radius)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '0.75rem',
              overflow: 'hidden',
            }}>
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectLocation(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    color: '#374151',
                    textAlign: 'left',
                  }}
                >
                  <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.display_name}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ width: '100%', height: 300, borderRadius: 'var(--admin-radius)', overflow: 'hidden', border: '1px solid var(--admin-border-standard)' }}>
            {typeof window !== 'undefined' ? (
              <MapContainerAny center={coords ? [coords.lat, coords.lng] : [26.14, 91.73]} zoom={coords ? 13 : 6} style={{ height: '100%', width: '100%' }}>
                <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {coords && <MarkerAny position={[coords.lat, coords.lng]} />}
                {coords && <MapRecenter coords={[coords.lat, coords.lng]} />}
              </MapContainerAny>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9fafb', color: '#9ca3af', fontStyle: 'italic', fontSize: '0.8125rem' }}>
                Loading map…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SEO & Discovery ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">SEO &amp; Discovery</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Meta Title"
              name="meta_title"
              defaultValue={initialData?.meta_title as string}
              placeholder="SEO title…"
            />
            <TextField
              label="Slug"
              name="slug"
              hint="URL-friendly"
              defaultValue={initialData?.slug as string}
              placeholder="auto-generated-slug"
            />
          </div>

          <TextField
            label="Meta Description"
            name="meta_description"
            multiline
            rows={2}
            defaultValue={initialData?.meta_description as string}
            placeholder="Short SEO description…"
          />

          <TagInput
            label="Discovery Tags"
            hint="e.g. hidden gem, adventure"
            value={tags}
            onChange={setTags}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="admin-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Discard
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update Destination' : 'Publish Destination'}
        </Button>
      </div>
    </form>
  )
}
