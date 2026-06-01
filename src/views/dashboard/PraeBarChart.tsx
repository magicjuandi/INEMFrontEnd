'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const months = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']

const PraeBarChart = () => {
  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, stacked: false },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '45%', borderRadius: 4, borderRadiusApplication: 'end' }
    },
    colors: ['#2F6F57', '#6FAE8A', '#2D6E8A'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      itemMargin: { horizontal: 10 }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 5,
      padding: { top: -10, left: 0, right: 0 }
    },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--mui-palette-text-secondary)' },
        formatter: (v: number) => Math.round(v).toString()
      }
    },
    tooltip: { shared: true, intersect: false }
  }

  const series = [
    { name: 'Actividades PRAE', data: [6, 7, 5, 8, 6, 7] },
    { name: 'Estudiantes participantes', data: [280, 310, 265, 340, 320, 348] },
    { name: 'Simulacros', data: [1, 0, 1, 1, 0, 1] }
  ]

  const stats = [
    { icon: 'ri-calendar-check-line', label: 'Actividades este mes', value: '7', color: '#2F6F57' },
    { icon: 'ri-group-line', label: 'Estudiantes participantes', value: '348', color: '#6FAE8A' },
    { icon: 'ri-alarm-warning-line', label: 'Simulacros realizados', value: '1', color: '#2D6E8A' }
  ]

  return (
    <Card>
      <CardHeader title='Gestión PRAE' subheader='Actividades ambientales y participación estudiantil — últimos 6 meses' />
      <CardContent sx={{ pt: 0 }}>
        <div className='flex gap-6 mbe-4 flex-wrap'>
          {stats.map((s, i) => (
            <div key={i} className='flex items-center gap-2'>
              <i className={`${s.icon} text-xl`} style={{ color: s.color }} />
              <div>
                <Typography variant='h6' color='text.primary' className='font-bold leading-none'>{s.value}</Typography>
                <Typography variant='caption' color='text.secondary'>{s.label}</Typography>
              </div>
            </div>
          ))}
        </div>
        <AppReactApexCharts type='bar' height={220} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default PraeBarChart
