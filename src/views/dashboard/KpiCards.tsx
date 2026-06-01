import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { mockData, CURRENT_IDX, variation, fmtNum, formatCOP } from '@/data/mockEnvironmental'

const e = mockData.energy
const w = mockData.water
const ws = mockData.waste
const g = mockData.greenAreas
const p = mockData.prae

const kpis = [
  {
    label: 'Energía eléctrica',
    value: fmtNum(e.consumptionKwh[CURRENT_IDX], 0),
    unit: 'kWh',
    icon: 'ri-flashlight-line',
    trend: variation(e.consumptionKwh),
    color: '#C98A2E', bg: 'rgba(201,138,46,0.10)'
  },
  {
    label: 'Consumo de agua',
    value: fmtNum(w.consumptionM3[CURRENT_IDX], 0),
    unit: 'm³',
    icon: 'ri-drop-line',
    trend: variation(w.consumptionM3),
    color: '#2D6E8A', bg: 'rgba(45,110,138,0.10)'
  },
  {
    label: 'Total residuos',
    value: fmtNum(
      ws.organicKg[CURRENT_IDX] + ws.recoveredKg[CURRENT_IDX] + ws.nonRecoveredKg[CURRENT_IDX],
      0
    ),
    unit: 'kg',
    icon: 'ri-recycle-line',
    trend: variation(ws.organicKg.map((v, i) => v + ws.recoveredKg[i] + ws.nonRecoveredKg[i])),
    color: '#B84A4A', bg: 'rgba(184,74,74,0.10)'
  },
  {
    label: 'Áreas verdes',
    value: fmtNum(g.maintainedAreaM2[CURRENT_IDX], 0),
    unit: 'm²',
    icon: 'ri-leaf-line',
    trend: null,
    color: '#2F6F57', bg: 'rgba(47,111,87,0.10)'
  },
  {
    label: 'Estudiantes PRAE',
    value: fmtNum(p.participatingStudentsCount[CURRENT_IDX], 0),
    unit: 'est.',
    icon: 'ri-group-line',
    trend: variation(p.participatingStudentsCount),
    color: '#2F6F57', bg: 'rgba(47,111,87,0.10)'
  }
]

const KpiCards = () => (
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
                    fontWeight: 600, fontSize: '0.7rem'
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
            <Typography variant='caption' color='text.disabled'>Mayo 2026</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)

export default KpiCards
