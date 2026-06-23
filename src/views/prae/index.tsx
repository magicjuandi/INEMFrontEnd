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
import Divider from '@mui/material/Divider'
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

const PraePage = () => {
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
  const p = data.prae

  const totalStudents = p.participatingStudentsCount.reduce((a, b) => a + b, 0)
  const totalActivities = p.executedActivitiesCount.reduce((a, b) => a + b, 0)
  const totalDrills = p.drillsCount.reduce((a, b) => a + b, 0)

  const praeKpis = [
    { label: 'Actividades PRAE', value: p.executedActivitiesCount[currentIdx].toLocaleString('es-CO'), unit: 'act.', icon: 'ri-calendar-check-line', trend: varPct(p.executedActivitiesCount, currentIdx), color: '#2F6F57', bg: 'rgba(47,111,87,0.10)', sub: `Acumulado: ${totalActivities}` },
    { label: 'Estudiantes participantes', value: p.participatingStudentsCount[currentIdx].toLocaleString('es-CO'), unit: 'est.', icon: 'ri-group-line', trend: varPct(p.participatingStudentsCount, currentIdx), color: '#6FAE8A', bg: 'rgba(111,174,138,0.10)', sub: `Acumulado: ${totalStudents}` },
    { label: 'Simulacros realizados', value: p.drillsCount[currentIdx].toLocaleString('es-CO'), unit: 'sim.', icon: 'ri-alarm-warning-line', trend: null, color: '#C98A2E', bg: 'rgba(201,138,46,0.10)', sub: `Acumulado: ${totalDrills}` }
  ]

  const praeOptions: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, stacked: false },
    plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4, borderRadiusApplication: 'end' } },
    colors: ['#2F6F57', '#6FAE8A', '#C98A2E'],
    legend: { position: 'top', horizontalAlign: 'left', itemMargin: { horizontal: 10 } },
    dataLabels: { enabled: false },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' }, formatter: (v: number) => Math.round(v).toString() } },
    tooltip: { shared: true, intersect: false }
  }

  type KpiItem = typeof praeKpis[0]

  const KpiCard = ({ k }: { k: KpiItem }) => (
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
        <Typography variant='caption' color='text.disabled'>{k.sub}</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex items-center gap-2 mbe-2'>
          <i className='ri-graduation-cap-line text-xl' style={{ color: '#2F6F57' }} />
          <Typography variant='h6' color='text.primary'>Gestión PRAE</Typography>
        </div>
        <Typography variant='body2' color='text.secondary'>Proyecto Ambiental Escolar — {data.longLabels[currentIdx]}</Typography>
        <Divider className='mbs-2' />
      </Grid>

      {praeKpis.map((k, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <KpiCard k={k} />
        </Grid>
      ))}

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Actividades y participación PRAE' subheader='Por mes' />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts type='bar' height={250} width='100%'
              series={[
                { name: 'Actividades PRAE', data: p.executedActivitiesCount },
                { name: 'Estudiantes participantes', data: p.participatingStudentsCount },
                { name: 'Simulacros', data: p.drillsCount }
              ]}
              options={praeOptions}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Historial mensual' subheader='Gestión PRAE' />
          <CardContent sx={{ pt: 0 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    {['Mes', 'Act. PRAE', 'Estudiantes', 'Simulacros'].map(h => (
                      <TableCell key={h} align={h === 'Mes' ? 'left' : 'right'}>
                        <Typography variant='caption' color='text.secondary' className='font-semibold'>{h}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.longLabels.map((mes, i) => {
                    const isCurrent = i === currentIdx

                    return (
                      <TableRow key={i} sx={{ backgroundColor: isCurrent ? 'rgba(47,111,87,0.06)' : 'transparent' }}>
                        <TableCell>
                          <Typography variant='body2' color={isCurrent ? 'text.primary' : 'text.secondary'} className={isCurrent ? 'font-semibold' : ''}>
                            {mes}{isCurrent ? ' ★' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'><Typography variant='body2'>{p.executedActivitiesCount[i]}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2' sx={{ color: '#6FAE8A' }}>{p.participatingStudentsCount[i].toLocaleString('es-CO')}</Typography></TableCell>
                        <TableCell align='right'><Typography variant='body2'>{p.drillsCount[i]}</Typography></TableCell>
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

export default PraePage
