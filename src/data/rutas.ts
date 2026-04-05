export type Dificultad =
  | 'sendero fácil'
  | 'moderado'
  | 'difícil'
  | 'alta montaña'
  | 'alpinismo ligero'
  | 'alpinismo técnico'

import { getAllPosts } from '../lib/wp'

export interface Ruta {
  slug: string
  filename: string
  title: string
  zone: string
  date: string // ISO: "2026-03-08"
  difficulty: Dificultad
  image: string
  duration: string // "6h 30min"
  // Stats principales
  distance_km: number
  elevation_gain: number
  elevation_loss: number
  max_elevation: number
  min_elevation: number
  // Técnicas
  max_slope: number
  mean_slope: number | null
  pct_over_30: number
  pct_over_40: number
  pct_over_45: number
  mean_aspect: string // "NNE · 22°"
  rugosity_mean: number
  exposed_pct: number
  // Perfil de desnivel (alturas en metros, ~20 puntos)
  elevationProfile: number[]
  // Descripción generada por IA
  description: string
  categories: string[]
  wikiloc_id: string | null
}

export const rutas: Ruta[] = await getAllPosts()

export function getRutaBySlug(slug: string): Ruta | undefined {
  return rutas.find((r) => r.slug === slug)
}

export function getLatestRuta(): Ruta {
  return rutas.reduce((latest, r) => (r.date > latest.date ? r : latest))
}

export const difficultyColor: Record<Dificultad, { bg: string; text: string }> =
  {
    'sendero fácil': { bg: '#5B9BD515', text: '#5B9BD5' },
    moderado: { bg: '#7C907015', text: '#7C9070' },
    'difícil': { bg: '#D4845E15', text: '#D4845E' },
    'alta montaña': { bg: '#B8603A15', text: '#B8603A' },
    'alpinismo ligero': { bg: '#C0392B15', text: '#C0392B' },
    'alpinismo técnico': { bg: '#7B0D0D15', text: '#7B0D0D' }
  }
