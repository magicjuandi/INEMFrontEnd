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

const RecyclablesBreakdown = ({ data, currentIdx }: Props) => {
  const w = data.waste

  const items = [
    { label: 'Papel y cartón', value: w.paperCardboardKg[currentIdx], color: '#C98A2E' },
    { label: 'Papel de oficina', value: w.officePaperKg[currentIdx], color: '#E0A94B' },
    { label: 'Periódico', value: w.newspaperKg[currentIdx], color: '#8A6D3B' },
    { label: 'Botellas plásticas', value: w.plasticBottlesKg[currentIdx], color: '#2D6E8A' },
    { label: 'Tapas plásticas', value: w.plasticCapsKg[currentIdx], color: '#6FAE8A' }
  ]

  const total = items.reduce((a, b) => a + b.value, 0)

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, borderRadiusApplication: 'end', distributed: true, barHeight: '60%' } },
    colors: items.map(i => i.color),
    legend: { show: false },
    dataLabels: { enabled: true, formatter: (v: number) => `${v} kg`, style: { fontSize: '11px', colors: ['#fff'] } },
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: {
      categories: items.map(i => i.label),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } }
    },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } } },
    tooltip: { y: { formatter: (v: number) => `${v} kg` } }
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Reciclables aprovechados'
        subheader={`${data.longLabels[currentIdx]} · Total ${total.toLocaleString('es-CO')} kg`}
      />
      <CardContent sx={{ pt: 0 }}>
        <AppReactApexCharts
          type='bar'
          height={240}
          width='100%'
          series={[{ name: 'Recuperado', data: items.map(i => i.value) }]}
          options={options}
        />
        <Typography variant='caption' color='text.disabled'>
          Desglose de materiales recuperados para reciclaje (kg)
        </Typography>
      </CardContent>
    </Card>
  )
}

export default RecyclablesBreakdown
