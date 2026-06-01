import type { EnvironmentalMonthlyRecord, ComputedIndicators } from '@/types/environmental'

export function calcVariation(current: number | null, previous: number | null): number | null {
  if (current == null || previous == null || previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function calcTotalWaste(organic = 0, recovered = 0, nonRecovered = 0): number {
  return (organic ?? 0) + (recovered ?? 0) + (nonRecovered ?? 0)
}

export function computeIndicators(
  current: EnvironmentalMonthlyRecord,
  previous: EnvironmentalMonthlyRecord | null
): ComputedIndicators {
  return {
    energy: {
      consumptionKwh: current.energy.consumptionKwh,
      costAmount: current.energy.costAmount,
      variationPct: calcVariation(current.energy.consumptionKwh, previous?.energy.consumptionKwh ?? null)
    },
    water: {
      consumptionM3: current.water.consumptionM3,
      costAmount: current.water.costAmount,
      variationPct: calcVariation(current.water.consumptionM3, previous?.water.consumptionM3 ?? null)
    },
    waste: {
      organicKg: current.waste.organicKg,
      recoveredKg: current.waste.recoveredKg,
      nonRecoveredKg: current.waste.nonRecoveredKg,
      totalKg: calcTotalWaste(
        current.waste.organicKg ?? 0,
        current.waste.recoveredKg ?? 0,
        current.waste.nonRecoveredKg ?? 0
      )
    },
    greenAreas: { ...current.greenAreas },
    prae: { ...current.prae }
  }
}

export function formatVariation(pct: number | null): { label: string; positive: boolean | null } {
  if (pct === null) return { label: 'Sin base comparativa', positive: null }
  const sign = pct >= 0 ? '+' : ''
  return { label: `${sign}${pct.toFixed(1)}%`, positive: pct <= 0 }
}

export function formatCurrency(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export function formatNumber(value: number | null, decimals = 2): string {
  if (value == null) return '—'
  return value.toLocaleString('es-CO', { maximumFractionDigits: decimals })
}

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function emptyRecord(year: number, month: number): EnvironmentalMonthlyRecord {
  return {
    year,
    month,
    status: 'draft',
    energy: { consumptionKwh: null, costAmount: null },
    water: { consumptionM3: null, costAmount: null },
    waste: { organicKg: null, recoveredKg: null, nonRecoveredKg: null },
    greenAreas: { maintainedAreaM2: null, plantedTreesCount: null, cleanupDaysCount: null },
    prae: { executedActivitiesCount: null, participatingStudentsCount: null, drillsCount: null }
  }
}
