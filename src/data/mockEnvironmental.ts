// Fuente única de datos demo — todos los componentes leen de aquí
// Meses: Dic 2025 → May 2026
export const MONTHS_LABELS = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']
export const MONTHS_FULL = ['Diciembre 2025', 'Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026']

export const mockData = {
  energy: {
    consumptionKwh: [5200, 5050, 4980, 5100, 4970, 4820],
    costAmount:     [1820000, 1767500, 1743000, 1785000, 1739500, 1687000]
  },
  water: {
    consumptionM3: [345, 338, 320, 330, 325, 312],
    costAmount:    [276000, 270400, 256000, 264000, 260000, 249600]
  },
  waste: {
    organicKg:       [520, 490, 470, 510, 495, 480],
    recoveredKg:     [410, 420, 415, 435, 440, 430],
    nonRecoveredKg:  [360, 345, 340, 355, 345, 330]
  },
  greenAreas: {
    maintainedAreaM2:  [820, 830, 840, 840, 845, 850],
    plantedTreesCount: [8, 5, 12, 6, 9, 11],
    cleanupDaysCount:  [2, 3, 3, 4, 3, 3]
  },
  prae: {
    executedActivitiesCount:    [6, 7, 5, 8, 6, 7],
    participatingStudentsCount: [280, 310, 265, 340, 320, 348],
    drillsCount:                [1, 0, 1, 1, 0, 1]
  }
}

// Índice del mes actual en el array (May 2026)
export const CURRENT_IDX = 5

// Helpers
export function current<T extends keyof typeof mockData>(section: T) {
  const s = mockData[section] as Record<string, number[]>
  return Object.fromEntries(Object.entries(s).map(([k, arr]) => [k, arr[CURRENT_IDX]])) as {
    [K in keyof (typeof mockData)[T]]: number
  }
}

export function variation(arr: number[]): number | null {
  const prev = arr[CURRENT_IDX - 1]
  const cur  = arr[CURRENT_IDX]
  if (!prev) return null
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

export function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
}

export function fmtNum(v: number, dec = 1) {
  return v.toLocaleString('es-CO', { maximumFractionDigits: dec })
}
