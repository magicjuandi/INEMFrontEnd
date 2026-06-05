'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { ApexOptions } from 'apexcharts'
import type { ChartDataShape } from '@/hooks/useEnvironmentalData'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type Props = { data: ChartDataShape; currentIdx: number }

const PraeBarChart = ({ data, currentIdx }: Props) => {
  const p = data.prae

  const stats = [
    { icon: 'ri-calendar-check-line', label: 'Actividades este mes', value: String(p.executedActivitiesCount[currentIdx]), color: '#2F6F57' },
    { icon: 'ri-group-line', label: 'Estudiantes participantes', value: String(p.participatingStudentsCount[currentIdx]), color: '#6FAE8A' },
    { icon: 'ri-alarm-warning-line', label: 'Simulacros realizados', value: String(p.drillsCount[currentIdx]), color: '#2D6E8A' }
  ]

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, stacked: false },
    plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4, borderRadiusApplication: 'end' } },
    colors: ['#2F6F57', '#6FAE8A', '#2D6E8A'],
    legend: { position: 'top', horizontalAlign: 'left', itemMargin: { horizontal: 10 } },
    dataLabels: { enabled: false },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' }, formatter: (v: number) => Math.round(v).toString() } },
    tooltip: { shared: true, intersect: false }
  }

  return (
    <Card>
      <CardHeader title='Gestión PRAE' subheader='Actividades y participación estudiantil' />
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
        <AppReactApexCharts
          type='bar'
          height={220}
          width='100%'
          series={[
            { name: 'Actividades PRAE', data: p.executedActivitiesCount },
            { name: 'Estudiantes participantes', data: p.participatingStudentsCount },
            { name: 'Simulacros', data: p.drillsCount }
          ]}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default PraeBarChart
