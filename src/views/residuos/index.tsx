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
import RecyclablesBreakdown from '@/views/dashboard/RecyclablesBreakdown'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

function varPct(arr: number[], idx: number): number | null {
  if (idx < 1 || !arr[idx - 1]) return null

  return Math.round(((arr[idx] - arr[idx - 1]) / arr[idx - 1]) * 100)
}

const ResiduosPage = () => {
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
  const ws = data.waste

  const organic = ws.organicKg[currentIdx]
  const recovered = ws.recoveredKg[currentIdx]
  const nonRecovered = ws.nonRecoveredKg[currentIdx]
  const total = organic + recovered + nonRecovered
  const recoveryRate = total > 0 ? Math.round((recovered / total) * 100) : 0
  const totalArr = ws.organicKg.map((v, i) => v + ws.recoveredKg[i] + ws.nonRecoveredKg[i])

  const kpis = [
    { label: 'Residuos orgánicos', value: organic.toLocaleString('es-CO'), unit: 'kg', icon: 'ri-leaf-line', trend: varPct(ws.organicKg, currentIdx), color: '#2F6F57', bg: 'rgba(47,111,87,0.10)' },
    { label: 'Residuos recuperados', value: recovered.toLocaleString('es-CO'), unit: 'kg', icon: 'ri-recycle-line', trend: varPct(ws.recoveredKg, currentIdx), color: '#6FAE8A', bg: 'rgba(111,174,138,0.10)' },
    { label: 'No recuperados', value: nonRecovered.toLocaleString('es-CO'), unit: 'kg', icon: 'ri-delete-bin-line', trend: varPct(ws.nonRecoveredKg, currentIdx), color: '#B84A4A', bg: 'rgba(184,74,74,0.10)' },
    { label: 'Total residuos', value: total.toLocaleString('es-CO'), unit: 'kg', icon: 'ri-archive-line', trend: null, color: '#2D6E8A', bg: 'rgba(45,110,138,0.10)', sub: `Tasa recuperación: ${recoveryRate}%` }
  ]

  const donutOptions: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    labels: ['Orgánicos', 'Recuperados', 'No recuperados'],
    colors: ['#2F6F57', '#6FAE8A', '#B84A4A'],
    legend: { position: 'bottom', markers: { offsetX: -3 }, itemMargin: { horizontal: 8, vertical: 4 } },
    plotOptions: { pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Total', color: 'var(--mui-palette-text-secondary)', formatter: () => `${total} kg` } } } } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} kg` } }
  }

  const stackedOptions: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, stacked: true },
    plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4, borderRadiusApplication: 'end' } },
    colors: ['#2F6F57', '#6FAE8A', '#B84A4A'],
    legend: { position: 'top', horizontalAlign: 'left', itemMargin: { horizontal: 10 } },
    dataLabels: { enabled: false },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' }, formatter: (v: number) => `${Math.round(v)} kg` } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v: number) => `${v} kg` } }
  }

  return (
    <Grid container spacing={6}>
      {kpis.map((k, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
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
                {k.value} <Typography component='span' variant='caption' color='text.secondary'>{k.unit}</Typography>
              </Typography>
              <Typography variant='body2' color='text.secondary'>{k.label}</Typography>
              {'sub' in k && <Typography variant='caption' color='text.disabled'>{k.sub}</Typography>}
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12} md={4}>
        <Card className='bs-full'>
          <CardHeader title='Composición de residuos' subheader={data.longLabels[currentIdx]} />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts type='donut' height={280} width='100%' series={[organic, recovered, nonRecovered]} options={donutOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card className='bs-full'>
          <CardHeader title='Distribución mensual de residuos' subheader='kg por categoría' />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts type='bar' height={280} width='100%'
              series={[
                { name: 'Orgánicos', data: ws.organicKg },
                { name: 'Recuperados', data: ws.recoveredKg },
                { name: 'No recuperados', data: ws.nonRecoveredKg }
              ]}
              options={stackedOptions}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <RecyclablesBreakdown data={data} currentIdx={currentIdx} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Historial mensual' subheader='Residuos sólidos' />
          <CardContent sx={{ pt: 0 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    {['Mes', 'Orgánicos (kg)', 'Recuperados (kg)', 'No recuperados (kg)', 'Total (kg)', 'Tasa recuperación'].map(h => (
                      <TableCell key={h} align={h === 'Mes' ? 'left' : 'right'}>
                        <Typography variant='caption' color='text.secondary' className='font-semibold'>{h}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.longLabels.map((mes, i) => {
                    const org = ws.organicKg[i]
                    const rec = ws.recoveredKg[i]
                    const nonRec = ws.nonRecoveredKg[i]
                    const tot = org + rec + nonRec
                    const rate = tot > 0 ? Math.round((rec / tot) * 100) : 0
                    const isCurrent = i === currentIdx

                    return (
                      <TableRow key={i} sx={{ backgroundColor: isCurrent ? 'rgba(47,111,87,0.06)' : 'transparent' }}>
                        <TableCell>
                          <Typography variant='body2' color={isCurrent ? 'text.primary' : 'text.secondary'} className={isCurrent ? 'font-semibold' : ''}>
                            {mes}{isCurrent ? ' ★' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'><Typography variant='body2'>{org.toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2' sx={{ color: '#6FAE8A' }}>{rec.toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2' sx={{ color: '#B84A4A' }}>{nonRec.toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2' className='font-semibold'>{tot.toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'>
                          <Chip size='small' label={`${rate}%`} sx={{ height: 20, fontSize: '0.68rem', backgroundColor: rate >= 40 ? 'rgba(47,111,87,0.12)' : 'rgba(184,74,74,0.12)', color: rate >= 40 ? '#2F6F57' : '#B84A4A' }} />
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

export default ResiduosPage
