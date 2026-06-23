'use client'

import { useState, useEffect } from 'react'

import type { EnvironmentalMonthlyRecord } from '@/types/environmental'
import { fetchRecords } from '@/services/googleScript'

const SHORT: Record<number, string> = {
  1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
}
const LONG: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
  7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
}

export type ChartDataShape = {
  labels: string[]
  longLabels: string[]
  locations: string[]
  energy: { consumptionKwh: number[]; costAmount: number[] }
  water: { consumptionM3: number[]; costAmount: number[] }
  waste: {
    organicKg: number[]
    recoveredKg: number[]
    nonRecoveredKg: number[]
    paperCardboardKg: number[]
    officePaperKg: number[]
    newspaperKg: number[]
    plasticBottlesKg: number[]
    plasticCapsKg: number[]
  }
  greenAreas: { maintainedAreaM2: number[]; plantedTreesCount: number[]; cleanupDaysCount: number[] }
  prae: { executedActivitiesCount: number[]; participatingStudentsCount: number[]; drillsCount: number[] }
}

function buildChartData(records: EnvironmentalMonthlyRecord[]): ChartDataShape {
  const sorted = [...records].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  )
  const n = (v: number | null) => v ?? 0

  return {
    labels: sorted.map(r => SHORT[r.month] ?? String(r.month)),
    longLabels: sorted.map(r => `${LONG[r.month] ?? r.month} ${r.year}`),
    locations: sorted.map(r => r.location ?? ''),
    energy: {
      consumptionKwh: sorted.map(r => n(r.energy.consumptionKwh)),
      costAmount: sorted.map(r => n(r.energy.costAmount)),
    },
    water: {
      consumptionM3: sorted.map(r => n(r.water.consumptionM3)),
      costAmount: sorted.map(r => n(r.water.costAmount)),
    },
    waste: {
      organicKg: sorted.map(r => n(r.waste.organicKg)),
      recoveredKg: sorted.map(r => n(r.waste.recoveredKg)),
      nonRecoveredKg: sorted.map(r => n(r.waste.nonRecoveredKg)),
      paperCardboardKg: sorted.map(r => n(r.waste.paperCardboardKg)),
      officePaperKg: sorted.map(r => n(r.waste.officePaperKg)),
      newspaperKg: sorted.map(r => n(r.waste.newspaperKg)),
      plasticBottlesKg: sorted.map(r => n(r.waste.plasticBottlesKg)),
      plasticCapsKg: sorted.map(r => n(r.waste.plasticCapsKg)),
    },
    greenAreas: {
      maintainedAreaM2: sorted.map(r => n(r.greenAreas.maintainedAreaM2)),
      plantedTreesCount: sorted.map(r => n(r.greenAreas.plantedTreesCount)),
      cleanupDaysCount: sorted.map(r => n(r.greenAreas.cleanupDaysCount)),
    },
    prae: {
      executedActivitiesCount: sorted.map(r => n(r.prae.executedActivitiesCount)),
      participatingStudentsCount: sorted.map(r => n(r.prae.participatingStudentsCount)),
      drillsCount: sorted.map(r => n(r.prae.drillsCount)),
    },
  }
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: ChartDataShape; records: EnvironmentalMonthlyRecord[]; currentIdx: number }

export function useEnvironmentalData() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchRecords().then(result => {
      if (cancelled) return
      if (!result.ok) {
        setState({ status: 'error', message: result.error })
      } else {
        const data = buildChartData(result.data)
        setState({
          status: 'ok',
          data,
          records: result.data,
          currentIdx: data.labels.length - 1,
        })
      }
    })
    return () => { cancelled = true }
  }, [])

  return state
}
