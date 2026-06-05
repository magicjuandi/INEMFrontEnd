'use client'

import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { ApexOptions } from 'apexcharts'
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

function varPct(arr: number[], idx: number): number | null {
  if (idx < 1 || !arr[idx - 1]) return null

  return Math.round(((arr[idx] - arr[idx - 1]) / arr[idx - 1]) * 100)
}

function formatCOP(v: number) {
  return `$${v.toLocaleString('es-CO')}`
}

const EnergiaPage = () => {
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
  const e = data.energy

  const varKwh = varPct(e.consumptionKwh, currentIdx)
  const varCost = varPct(e.costAmount, currentIdx)
  const costPerKwh = e.costAmount[currentIdx] && e.consumptionKwh[currentIdx]
    ? Math.round(e.costAmount[currentIdx] / e.consumptionKwh[currentIdx])
    : 0

  const kpis = [
    { label: 'Consumo eléctrico', value: e.consumptionKwh[currentIdx].toLocaleString('es-CO'), unit: 'kWh', icon: 'ri-flashlight-line', trend: varKwh, color: '#C98A2E', bg: 'rgba(201,138,46,0.10)', sub: 'vs. mes anterior' },
    { label: 'Costo energético', value: formatCOP(e.costAmount[currentIdx]), unit: '', icon: 'ri-money-dollar-circle-line', trend: varCost, color: '#C98A2E', bg: 'rgba(201,138,46,0.10)', sub: 'vs. mes anterior' },
    { label: 'Costo por kWh', value: costPerKwh.toLocaleString('es-CO'), unit: 'COP/kWh', icon: 'ri-price-tag-3-line', trend: null, color: '#2F6F57', bg: 'rgba(47,111,87,0.10)', sub: 'tarifa promedio' }
  ]

  const trendOptions: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#C98A2E'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' }, formatter: (v: number) => `${Math.round(v)}` } },
    markers: { size: 5 },
    tooltip: { y: { formatter: (v: number) => `${v.toLocaleString('es-CO')} kWh` } }
  }

  const costOptions: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, borderRadiusApplication: 'end', columnWidth: '50%', distributed: true } },
    colors: e.costAmount.map((_, i) => i === currentIdx ? '#C98A2E' : 'rgba(201,138,46,0.40)'),
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' }, formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M` } },
    tooltip: { y: { formatter: (v: number) => formatCOP(v) } }
  }

  return (
    <Grid container spacing={6}>
      {kpis.map((k, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card sx={{ borderTop: `3px solid ${k.color}` }}>
            <CardContent>
              <div className='flex items-center justify-between mbe-3'>
                <div className='flex items-center justify-center rounded-full' style={{ width: 40, height: 40, background: k.bg }}>
                  <i className={`${k.icon} text-xl`} style={{ color: k.color }} />
                </div>
                {k.trend !== null && (
                  <Chip size='small' label={`${k.trend > 0 ? '+' : ''}${k.trend}%`}
                    sx={{ backgroundColor: k.trend <= 0 ? 'rgba(47,111,87,0.12)' : 'rgba(184,74,74,0.12)', color: k.trend <= 0 ? '#2F6F57' : '#B84A4A', fontWeight: 600, fontSize: '0.7rem' }}
                    icon={<i className={k.trend <= 0 ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} style={{ color: k.trend <= 0 ? '#2F6F57' : '#B84A4A', fontSize: 12 }} />}
                  />
                )}
              </div>
              <Typography variant='h5' color='text.primary' className='font-bold mbe-0.5'>
                {k.value}{k.unit ? ' ' : ''}<Typography component='span' variant='caption' color='text.secondary'>{k.unit}</Typography>
              </Typography>
              <Typography variant='body2' color='text.secondary'>{k.label}</Typography>
              <Typography variant='caption' color='text.disabled'>{k.sub}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader title='Tendencia de consumo eléctrico' subheader={`Últimos ${data.labels.length} registros (kWh)`} />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts type='area' height={280} width='100%' series={[{ name: 'Consumo (kWh)', data: e.consumptionKwh }]} options={trendOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card className='bs-full'>
          <CardHeader title='Costo energético' subheader='Por mes (COP)' />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts type='bar' height={280} width='100%' series={[{ name: 'Costo (COP)', data: e.costAmount }]} options={costOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Historial mensual' subheader='Energía eléctrica' />
          <CardContent sx={{ pt: 0 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    {['Mes', 'Consumo (kWh)', 'Costo (COP)', 'COP/kWh', 'Var. consumo'].map(h => (
                      <TableCell key={h} align={h === 'Mes' ? 'left' : 'right'}>
                        <Typography variant='caption' color='text.secondary' className='font-semibold'>{h}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.longLabels.map((mes, i) => {
                    const kwh = e.consumptionKwh[i]
                    const cost = e.costAmount[i]
                    const prev = i > 0 ? e.consumptionKwh[i - 1] : null
                    const vp = prev ? ((kwh - prev) / prev * 100).toFixed(1) : null
                    const isCurrent = i === currentIdx

                    return (
                      <TableRow key={i} sx={{ backgroundColor: isCurrent ? 'rgba(201,138,46,0.06)' : 'transparent' }}>
                        <TableCell>
                          <Typography variant='body2' color={isCurrent ? 'text.primary' : 'text.secondary'} className={isCurrent ? 'font-semibold' : ''}>
                            {mes}{isCurrent ? ' ★' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'><Typography variant='body2'>{kwh.toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2'>{formatCOP(cost)}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2'>{kwh ? Math.round(cost / kwh).toLocaleString('es-CO') : '—'}</Typography></TableCell>
                        <TableCell align='right'>
                          {vp !== null
                            ? <Chip size='small' label={`${Number(vp) > 0 ? '+' : ''}${vp}%`} sx={{ height: 20, fontSize: '0.68rem', backgroundColor: Number(vp) <= 0 ? 'rgba(47,111,87,0.12)' : 'rgba(184,74,74,0.12)', color: Number(vp) <= 0 ? '#2F6F57' : '#B84A4A' }} />
                            : <Typography variant='caption' color='text.disabled'>—</Typography>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EnergiaPage
