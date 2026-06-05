'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import type { ChartDataShape } from '@/hooks/useEnvironmentalData'

type Props = { data: ChartDataShape; currentIdx: number }

function varPct(arr: number[], idx: number): number | null {
  if (idx < 1 || !arr[idx - 1]) return null

  return Math.round(((arr[idx] - arr[idx - 1]) / arr[idx - 1]) * 100)
}

const KpiCards = ({ data, currentIdx }: Props) => {
  const e = data.energy
  const w = data.water
  const ws = data.waste
  const g = data.greenAreas
  const p = data.prae
  const totalArr = ws.organicKg.map((v, i) => v + ws.recoveredKg[i] + ws.nonRecoveredKg[i])

  const kpis = [
    { label: 'Energía eléctrica', value: e.consumptionKwh[currentIdx].toLocaleString('es-CO'), unit: 'kWh', icon: 'ri-flashlight-line', trend: varPct(e.consumptionKwh, currentIdx), color: '#C98A2E', bg: 'rgba(201,138,46,0.10)' },
    { label: 'Consumo de agua', value: w.consumptionM3[currentIdx].toLocaleString('es-CO'), unit: 'm³', icon: 'ri-drop-line', trend: varPct(w.consumptionM3, currentIdx), color: '#2D6E8A', bg: 'rgba(45,110,138,0.10)' },
    { label: 'Total residuos', value: totalArr[currentIdx].toLocaleString('es-CO'), unit: 'kg', icon: 'ri-recycle-line', trend: varPct(totalArr, currentIdx), color: '#B84A4A', bg: 'rgba(184,74,74,0.10)' },
    { label: 'Áreas verdes', value: g.maintainedAreaM2[currentIdx].toLocaleString('es-CO'), unit: 'm²', icon: 'ri-leaf-line', trend: null, color: '#2F6F57', bg: 'rgba(47,111,87,0.10)' },
    { label: 'Estudiantes PRAE', value: p.participatingStudentsCount[currentIdx].toLocaleString('es-CO'), unit: 'est.', icon: 'ri-group-line', trend: varPct(p.participatingStudentsCount, currentIdx), color: '#2F6F57', bg: 'rgba(47,111,87,0.10)' },
  ]

  return (
    <Grid container spacing={4}>
      {kpis.map((k, i) => (
        <Grid item xs={12} sm={6} md={4} lg key={i}>
          <Card className='bs-full' sx={{ borderTop: `3px solid ${k.color}` }}>
            <CardContent>
              <div className='flex items-center justify-between mbe-3'>
                <div className='flex items-center justify-center rounded-full' style={{ width: 40, height: 40, background: k.bg }}>
                  <i className={`${k.icon} text-xl`} style={{ color: k.color }} />
                </div>
                {k.trend !== null && (
                  <Chip
                    size='small'
                    label={`${k.trend > 0 ? '+' : ''}${k.trend}%`}
                    sx={{
                      backgroundColor: k.trend <= 0 ? 'rgba(47,111,87,0.12)' : 'rgba(184,74,74,0.12)',
                      color: k.trend <= 0 ? '#2F6F57' : '#B84A4A',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                    icon={<i className={k.trend <= 0 ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} style={{ color: k.trend <= 0 ? '#2F6F57' : '#B84A4A', fontSize: 12 }} />}
                  />
                )}
              </div>
              <Typography variant='h5' color='text.primary' className='font-bold mbe-0.5'>
                {k.value}{' '}
                <Typography component='span' variant='caption' color='text.secondary'>{k.unit}</Typography>
              </Typography>
              <Typography variant='body2' color='text.secondary'>{k.label}</Typography>
              <Typography variant='caption' color='text.disabled'>{data.longLabels[currentIdx]}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default KpiCards
