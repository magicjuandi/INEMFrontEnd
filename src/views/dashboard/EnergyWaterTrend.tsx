'use client'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { ApexOptions } from 'apexcharts'
import { mockData, MONTHS_LABELS, CURRENT_IDX, fmtNum } from '@/data/mockEnvironmental'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const avgEnergy = Math.round(mockData.energy.consumptionKwh.reduce((a, b) => a + b, 0) / mockData.energy.consumptionKwh.length)
const avgWater  = Math.round(mockData.water.consumptionM3.reduce((a, b) => a + b, 0) / mockData.water.consumptionM3.length)

const EnergyWaterTrend = () => {
  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { width: [3, 3], curve: 'smooth' },
    legend: { position: 'top', horizontalAlign: 'left', markers: { offsetX: -4 }, itemMargin: { horizontal: 10 } },
    colors: ['#C98A2E', '#2D6E8A'],
    grid: { borderColor: 'var(--mui-palette-divider)', strokeDashArray: 5, padding: { top: -10, left: 0, right: 0 } },
    xaxis: {
      categories: MONTHS_LABELS,
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: 'var(--mui-palette-text-secondary)', fontSize: '12px' } }
    },
    yaxis: [
      { seriesName: 'Energía (kWh)', labels: { style: { colors: '#C98A2E' }, formatter: v => `${v}` }, title: { text: 'kWh', style: { color: '#C98A2E', fontWeight: 400 } } },
      { seriesName: 'Agua (m³)', opposite: true, labels: { style: { colors: '#2D6E8A' }, formatter: v => `${v}` }, title: { text: 'm³', style: { color: '#2D6E8A', fontWeight: 400 } } }
    ],
    tooltip: { shared: true, y: [{ formatter: (v: number) => `${v} kWh` }, { formatter: (v: number) => `${v} m³` }] },
    markers: { size: 4 }
  }

  return (
    <Card>
      <CardHeader title='Tendencia de consumo' subheader='Energía eléctrica y agua — últimos 6 meses' />
      <CardContent sx={{ pt: 0 }}>
        <AppReactApexCharts type='line' height={280} width='100%'
          series={[
            { name: 'Energía (kWh)', data: mockData.energy.consumptionKwh },
            { name: 'Agua (m³)',     data: mockData.water.consumptionM3 }
          ]}
          options={options}
        />
        <div className='flex gap-6 mbs-2 flex-wrap'>
          <div>
            <Typography variant='caption' color='text.secondary'>Prom. energía</Typography>
            <Typography variant='body2' color='text.primary' className='font-semibold'>{fmtNum(avgEnergy, 0)} kWh/mes</Typography>
          </div>
          <div>
            <Typography variant='caption' color='text.secondary'>Prom. agua</Typography>
            <Typography variant='body2' color='text.primary' className='font-semibold'>{fmtNum(avgWater, 0)} m³/mes</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EnergyWaterTrend
