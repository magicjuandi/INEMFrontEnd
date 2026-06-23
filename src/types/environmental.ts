export type RecordStatus = 'draft' | 'submitted' | 'validated'

export type EnergyData = {
  consumptionKwh: number | null
  costAmount: number | null
}

export type WaterData = {
  consumptionM3: number | null
  costAmount: number | null
}

export type WasteData = {
  organicKg: number | null
  recoveredKg: number | null
  nonRecoveredKg: number | null
  paperCardboardKg: number | null
  officePaperKg: number | null
  newspaperKg: number | null
  plasticBottlesKg: number | null
  plasticCapsKg: number | null
}

export type GreenAreasData = {
  maintainedAreaM2: number | null
  plantedTreesCount: number | null
  cleanupDaysCount: number | null
}

export type PraeData = {
  executedActivitiesCount: number | null
  participatingStudentsCount: number | null
  drillsCount: number | null
}

export type EnvironmentalMonthlyRecord = {
  id?: string
  year: number
  month: number
  status: RecordStatus
  location?: string | null
  timestamp?: string | null
  energy: EnergyData
  water: WaterData
  waste: WasteData
  greenAreas: GreenAreasData
  prae: PraeData
}

export type ComputedIndicators = {
  energy: {
    consumptionKwh: number | null
    costAmount: number | null
    variationPct: number | null
  }
  water: {
    consumptionM3: number | null
    costAmount: number | null
    variationPct: number | null
  }
  waste: {
    organicKg: number | null
    recoveredKg: number | null
    nonRecoveredKg: number | null
    paperCardboardKg: number | null
    officePaperKg: number | null
    newspaperKg: number | null
    plasticBottlesKg: number | null
    plasticCapsKg: number | null
    recyclablesTotalKg: number
    totalKg: number
  }
  greenAreas: {
    maintainedAreaM2: number | null
    plantedTreesCount: number | null
    cleanupDaysCount: number | null
  }
  prae: {
    executedActivitiesCount: number | null
    participatingStudentsCount: number | null
    drillsCount: number | null
  }
}
