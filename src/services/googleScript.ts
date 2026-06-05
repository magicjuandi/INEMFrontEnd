import type { EnvironmentalMonthlyRecord } from '@/types/environmental'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw7cK3nZzUI8FJ4EIlmG1mTDYpBPE1nPsclzUbqToemIrIoEyCnZu6PLW6u16EcfGva/exec'

export type ApiResponse<T = unknown> = { ok: true; data: T } | { ok: false; error: string }

type FlatRow = {
  fecha?: string
  year?: number
  month?: number
  energia_kwh?: number | null
  costo_energia?: number | null
  agua_m3?: number | null
  costo_agua?: number | null
  residuos_organicos_kg?: number | null
  residuos_aprovechables_kg?: number | null
  residuos_no_aprovechables_kg?: number | null
  area_zonas_verdes_m2?: number | null
  arboles_sembrados?: number | null
  jornadas_limpieza?: number | null
  actividades_prae?: number | null
  estudiantes_participantes?: number | null
  simulacros?: number | null
  status?: string
  id?: string
}

function mapFlatRow(row: FlatRow): EnvironmentalMonthlyRecord {
  let year: number
  let month: number

  if (row.year && row.month) {
    year = row.year
    month = row.month
  } else if (row.fecha) {
    const d = new Date(row.fecha)
    year = d.getFullYear()
    month = d.getMonth() + 1
  } else {
    const now = new Date()
    year = now.getFullYear()
    month = now.getMonth() + 1
  }

  const n = (v: number | null | undefined): number | null => (v == null ? null : Number(v))

  return {
    id: row.id,
    year,
    month,
    status: (row.status as EnvironmentalMonthlyRecord['status']) ?? 'submitted',
    energy: {
      consumptionKwh: n(row.energia_kwh),
      costAmount: n(row.costo_energia),
    },
    water: {
      consumptionM3: n(row.agua_m3),
      costAmount: n(row.costo_agua),
    },
    waste: {
      organicKg: n(row.residuos_organicos_kg),
      recoveredKg: n(row.residuos_aprovechables_kg),
      nonRecoveredKg: n(row.residuos_no_aprovechables_kg),
    },
    greenAreas: {
      maintainedAreaM2: n(row.area_zonas_verdes_m2),
      plantedTreesCount: n(row.arboles_sembrados),
      cleanupDaysCount: n(row.jornadas_limpieza),
    },
    prae: {
      executedActivitiesCount: n(row.actividades_prae),
      participatingStudentsCount: n(row.estudiantes_participantes),
      drillsCount: n(row.simulacros),
    },
  }
}

function isFlat(row: unknown): row is FlatRow {
  if (!row || typeof row !== 'object') return false
  const r = row as Record<string, unknown>
  return 'energia_kwh' in r || 'residuos_organicos_kg' in r || 'fecha' in r
}

function normalizeRecord(row: unknown): EnvironmentalMonthlyRecord {
  if (isFlat(row)) return mapFlatRow(row as FlatRow)
  return row as EnvironmentalMonthlyRecord
}

export async function fetchRecords(params?: {
  action?: string
  year?: number
  month?: number
}): Promise<ApiResponse<EnvironmentalMonthlyRecord[]>> {
  try {
    const url = new URL(SCRIPT_URL)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v))
      })
    }

    const res = await fetch(url.toString(), { method: 'GET' })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }

    const json = await res.json()
    const raw: unknown[] = Array.isArray(json) ? json : (json.data ?? [])
    const records = raw.map(normalizeRecord)

    return { ok: true, data: records }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function submitRecord(
  record: EnvironmentalMonthlyRecord
): Promise<ApiResponse<{ id?: string }>> {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'submitRecord', data: record }),
      redirect: 'follow',
    })

    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    const json = await res.json().catch(() => ({}))
    return { ok: true, data: json }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}
