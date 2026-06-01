import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import KpiCards from '@views/dashboard/KpiCards'
import EnergyWaterTrend from '@views/dashboard/EnergyWaterTrend'
import WasteDonut from '@views/dashboard/WasteDonut'
import GreenAreasSummary from '@views/dashboard/GreenAreasSummary'
import PraeBarChart from '@views/dashboard/PraeBarChart'

export const metadata = {
  title: 'Resumen General — INEM Verde'
}

const Dashboard = () => {
  return (
    <Grid container spacing={6}>

      {/* Título */}
      <Grid item xs={12}>
        <Typography variant='h5' color='text.primary' className='font-semibold'>
          Resumen General
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Panel de Sostenibilidad Escolar — Mayo 2026
        </Typography>
      </Grid>

      {/* KPIs */}
      <Grid item xs={12}>
        <KpiCards />
      </Grid>

      {/* Tendencia energía + agua */}
      <Grid item xs={12} lg={8}>
        <EnergyWaterTrend />
      </Grid>

      {/* Composición residuos */}
      <Grid item xs={12} lg={4}>
        <WasteDonut />
      </Grid>

      {/* Gestión PRAE */}
      <Grid item xs={12} lg={8}>
        <PraeBarChart />
      </Grid>

      {/* Áreas verdes */}
      <Grid item xs={12} lg={4}>
        <GreenAreasSummary />
      </Grid>

    </Grid>
  )
}

export default Dashboard
