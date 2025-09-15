import { prisma } from './prisma'

export async function geocode(address: string) {
  // check cache
  const hash = Buffer.from(address).toString('base64').slice(0, 64)
  const cached = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "geocode_cache" WHERE "address_hash"='${hash}' LIMIT 1`)
  if (cached?.[0]) return { lat: cached[0].lat, lng: cached[0].lng }
  const key = process.env.GEOAPIFY_API_KEY
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${key}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  const f = data.features?.[0]?.properties
  const lat = f?.lat, lng = f?.lon
  if (lat && lng) {
    await prisma.$executeRawUnsafe(`INSERT INTO "geocode_cache"("address_hash","lat","lng","provider","updated_at") VALUES ('${hash}', ${lat}, ${lng}, 'geoapify', NOW()) ON CONFLICT (address_hash) DO UPDATE SET lat=${lat}, lng=${lng}, updated_at=NOW()`)
  }
  return { lat, lng }
}
