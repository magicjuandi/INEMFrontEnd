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

const WasteDonut = ({ data, currentIdx }: Props) => {
  const w = data.waste
  const organic = w.organicKg[currentIdx]
  const recovered = w.recoveredKg[currentIdx]
  const nonRecovered = w.nonRecoveredKg[currentIdx]
  const total = organic + recovered + nonRecovered

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    labels: ['Orgánicos', 'Recuperados', 'No recuperados'],
    colors: ['#2F6F57', '#6FAE8A', '#B84A4A'],
    legend: { position: 'bottom', markers: { offsetX: -3 }, itemMargin: { horizontal: 8, vertical: 4 } },
    plotOptions: {
      pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Total', color: 'var(--mui-palette-text-secondary)', formatter: () => `${total} kg` } } } }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} kg` } }
  }

  const legend = [
    { label: 'Orgánicos', value: `${organic} kg`, color: '#2F6F57' },
    { label: 'Recuperados', value: `${recovered} kg`, color: '#6FAE8A' },
    { label: 'No recuperados', value: `${nonRecovered} kg`, color: '#B84A4A' }
  ]

  return (
    <Card className='bs-full'>
      <CardHeader title='Composición de residuos' subheader={data.longLabels[currentIdx]} />
      <CardContent sx={{ pt: 0 }}>
        <AppReactApexCharts type='donut' height={220} width='100%' series={[organic, recovered, nonRecovered]} options={options} />
        <div className='flex flex-col gap-2 mbs-2'>
          {legend.map((l, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                <Typography variant='body2' color='text.secondary'>{l.label}</Typography>
              </div>
              <Typography variant='body2' color='text.primary' className='font-medium'>{l.value}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WasteDonut
