import type { Ruta, Dificultad } from '../data/rutas'

function decodeHtml(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

const domain = import.meta.env.WP_DOMAIN
const apiURL = `${domain}/wp-json/wp/v2/`

export const getPageInfo = async (slug: string) => {
  const response = await fetch(`${apiURL}pages?slug=${slug}`)
  if (!response.ok) throw new Error('Fail')
  const [data] = await response.json()
  return {
    title: decodeHtml(data.title.rendered),
    content: data.content.rendered
  }
}

const mapPost = (data: any): Ruta => {
  const rawProfile = data.acf.elevation_chart_data
  const elevationProfile: number[] = rawProfile
    ? String(rawProfile).replace(/^\[|\]$/g, '').split(',').map(Number)
    : [
        1344, 1420, 1530, 1680, 1820, 1980, 2100, 2240, 2380, 2480, 2592, 2540,
        2480, 2380, 2200, 2050, 1900, 1700, 1520, 1344
      ]

  return {
    slug: data.slug,
    filename: data.acf.filename,
    title: decodeHtml(data.title.rendered),
    zone: data.acf.zone,
    date: data.date.slice(0, 10),
    difficulty: String(data.acf.difficulty ?? '')
      .toLowerCase()
      .trim() as Dificultad,
    image: data._embedded['wp:featuredmedia']?.[0]?.source_url ?? null,
    duration: data.acf.duration,
    distance_km: data.acf.distancia_km,
    elevation_gain: data.acf.elevation_gain,
    elevation_loss: data.acf.elevation_loss,
    max_elevation: data.acf.max_elevation,
    min_elevation: data.acf.min_elevation,
    max_slope: data.acf.max_slope,
    mean_slope: data.acf['pendiente_media_%'] ?? data.acf.pendiente_media_pct ?? data.acf.pendiente_media ?? data.acf.mean_slope ?? null,
    pct_over_30: data.acf.pct_over_30,
    pct_over_40: data.acf.pct_over_40,
    pct_over_45: data.acf.pct_over_45,
    mean_aspect: String(data.acf.mean_aspect),
    rugosity_mean: data.acf.rugosity_mean,
    exposed_pct: data.acf.exposed_pct,
    elevationProfile,
    description: data.acf.ai_description,
    categories: (data._embedded?.['wp:term']?.[0] ?? []).map((t: any) => t.name as string),
    wikiloc_id: data.acf.wikiloc_id ? String(data.acf.wikiloc_id) : null
  }
}

export const getPostsInfo = async (slug: string): Promise<Ruta> => {
  const response = await fetch(`${apiURL}posts?slug=${slug}&_embed`)
  if (!response.ok) throw new Error('Fail')
  const [data] = await response.json()
  return mapPost(data)
}

export const getAllPosts = async (): Promise<Ruta[]> => {
  const response = await fetch(`${apiURL}posts?per_page=100&_embed`)
  if (!response.ok) throw new Error('Fail')
  const data: any[] = await response.json()
  return data.map(mapPost)
}
