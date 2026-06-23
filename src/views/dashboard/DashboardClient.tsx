'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import { useEnvironmentalData } from '@/hooks/useEnvironmentalData'
import KpiCards from './KpiCards'
import EnergyWaterTrend from './EnergyWaterTrend'
import WasteDonut from './WasteDonut'
import RecyclablesBreakdown from './RecyclablesBreakdown'
import GreenAreasSummary from './GreenAreasSummary'
import PraeBarChart from './PraeBarChart'

const DashboardClient = () => {
  const state = useEnvironmentalData()

  if (state.status === 'loading') {
    return (
      <div className='flex items-center justify-center' style={{ minHeight: 300 }}>
        <CircularProgress color='primary' />
      </div>
    )
  }

  if (state.status === 'error') {
    return <Alert severity='error'>No se pudo cargar la información: {state.message}</Alert>
  }

  const { data, currentIdx } = state
  const currentLabel = data.longLabels[currentIdx] ?? ''
  const currentLocation = data.locations[currentIdx] ?? ''

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5' color='text.primary' className='font-semibold'>
          Resumen General
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Panel de Sostenibilidad Escolar — {currentLabel}
          {currentLocation ? ` · ${currentLocation}` : ''}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <KpiCards data={data} currentIdx={currentIdx} />
      </Grid>

      <Grid item xs={12} lg={8}>
        <EnergyWaterTrend data={data} />
      </Grid>

      <Grid item xs={12} lg={4}>
        <WasteDonut data={data} currentIdx={currentIdx} />
      </Grid>

      <Grid item xs={12}>
        <RecyclablesBreakdown data={data} currentIdx={currentIdx} />
      </Grid>

      <Grid item xs={12} lg={8}>
        <PraeBarChart data={data} currentIdx={currentIdx} />
      </Grid>

      <Grid item xs={12} lg={4}>
        <GreenAreasSummary data={data} currentIdx={currentIdx} />
      </Grid>
    </Grid>
  )
}

export default DashboardClient
