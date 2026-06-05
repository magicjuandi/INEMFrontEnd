'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { ApexOptions } from 'apexcharts'
import type { ChartDataShape } from '@/hooks/useEnvironmentalData'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type Props = { data: ChartDataShape; currentIdx: number }

const GreenAreasSummary = ({ data, currentIdx }: Props) => {
  const g = data.greenAreas
  const totalTrees = g.plantedTreesCount.reduce((a, b) => a + b, 0)

  const items = [
    { label: 'Zonas verdes mantenidas', value: `${g.maintainedAreaM2[currentIdx]} m²`, pct: Math.round((g.maintainedAreaM2[currentIdx] / 1000) * 100), color: '#2F6F57' },
    { label: 'Árboles sembrados (acum.)', value: `${totalTrees} árboles`, pct: Math.round((totalTrees / 80) * 100), color: '#6FAE8A' },
    { label: 'Jornadas de limpieza', value: `${g.cleanupDaysCount[currentIdx]} jornadas`, pct: Math.round((g.cleanupDaysCount[currentIdx] / 4) * 100), color: '#2D6E8A' }
  ]

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4, borderRadiusApplication: 'end', distributed: true } },
    colors: g.plantedTreesCount.map((_, i) => i === currentIdx ? '#2F6F57' : '#6FAE8A'),
    legend: { show: false },
    dataLabels: { enabled: false },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -15, left: -5, right: 0, bottom: 0 } },
    xaxis: { categories: data.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' } } },
    tooltip: { y: { formatter: (v: number) => `${v} árboles` } }
  }

  return (
    <Card className='bs-full'>
      <CardHeader title='Áreas verdes y biodiversidad' subheader={data.longLabels[currentIdx]} />
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
                value={Math.min(item.pct, 100)}
                sx={{ height: 6, borderRadius: 3, backgroundColor: 'var(--mui-palette-customColors-trackBg)', '& .MuiLinearProgress-bar': { backgroundColor: item.color, borderRadius: 3 } }}
              />
              <Typography variant='caption' color='text.disabled'>{Math.min(item.pct, 100)}% de meta</Typography>
            </div>
          ))}
        </div>
        <Typography variant='caption' color='text.secondary' className='font-medium mbe-1 block'>Árboles sembrados por mes</Typography>
        <AppReactApexCharts type='bar' height={110} width='100%' series={[{ name: 'Árboles sembrados', data: g.plantedTreesCount }]} options={options} />
      </CardContent>
    </Card>
  )
}

export default GreenAreasSummary
