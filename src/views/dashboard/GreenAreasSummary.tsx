'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const months = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']

const GreenAreasSummary = () => {
  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, sparkline: { enabled: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%', borderRadius: 4, borderRadiusApplication: 'end', distributed: true }
    },
    colors: ['#6FAE8A', '#6FAE8A', '#6FAE8A', '#2F6F57', '#6FAE8A', '#2F6F57'],
    legend: { show: false },
    dataLabels: { enabled: false },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 5,
      padding: { top: -15, left: -5, right: 0, bottom: 0 }
    },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '11px' } }
    },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' } } },
    tooltip: { y: { formatter: (v: number) => `${v} árboles` } }
  }

  const series = [{ name: 'Árboles sembrados', data: [8, 5, 12, 6, 9, 11] }]

  const items = [
    { label: 'Zonas verdes mantenidas', value: '850 m²', goal: 1000, pct: 85, color: '#2F6F57' },
    { label: 'Árboles sembrados (acum.)', value: '51 árboles', goal: 80, pct: 64, color: '#6FAE8A' },
    { label: 'Jornadas de limpieza', value: '3 jornadas', goal: 4, pct: 75, color: '#2D6E8A' }
  ]

  return (
    <Card className='bs-full'>
      <CardHeader title='Áreas verdes y biodiversidad' subheader='Mayo 2026' />
      <CardContent sx={{ pt: 0 }}>
        <div className='flex flex-col gap-4 mbe-4'>
          {items.map((item, i) => (
            <div key={i}>
              <div className='flex justify-between mbe-1'>
                <Typography variant='body2' color='text.secondary'>{item.label}</Typography>
                <Typography variant='body2' color='text.primary' className='font-medium'>{item.value}</Typography>
              </div>
              <LinearProgress
                variant='determinate'
                value={item.pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'var(--mui-palette-customColors-trackBg)',
                  '& .MuiLinearProgress-bar': { backgroundColor: item.color, borderRadius: 3 }
                }}
              />
              <Typography variant='caption' color='text.disabled'>{item.pct}% de meta mensual</Typography>
            </div>
          ))}
        </div>
        <Typography variant='caption' color='text.secondary' className='font-medium mbe-1 block'>
          Árboles sembrados por mes
        </Typography>
        <AppReactApexCharts type='bar' height={110} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default GreenAreasSummary
