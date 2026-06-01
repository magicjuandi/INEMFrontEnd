'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type Props = {
  label: string
  value: string
  unit?: string
  source?: string
  variation?: { label: string; positive: boolean | null } | null
  icon: string
  color?: 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success'
}

const IndicatorCard = ({ label, value, unit, source, variation, icon, color = 'primary' }: Props) => {
  const colorMap: Record<string, string> = {
    primary: 'var(--mui-palette-primary-main)',
    secondary: 'var(--mui-palette-secondary-main)',
    warning: 'var(--mui-palette-warning-main)',
    error: 'var(--mui-palette-error-main)',
    info: 'var(--mui-palette-info-main)',
    success: 'var(--mui-palette-success-main)'
  }

  return (
    <Card variant='outlined' className='bs-full' sx={{ borderColor: colorMap[color], borderRadius: 2 }}>
      <CardContent>
        <div className='flex items-center gap-2 mbe-3'>
          <i className={`${icon} text-xl`} style={{ color: colorMap[color] }} />
          <Typography variant='body2' color='text.secondary' className='font-medium'>
            {label}
          </Typography>
        </div>
        <div className='flex items-baseline gap-1 mbe-1 flex-wrap'>
          <Typography variant='h5' color='text.primary' className='font-semibold'>
            {value}
          </Typography>
          {unit && (
            <Typography variant='caption' color='text.secondary'>
              {unit}
            </Typography>
          )}
        </div>
        {variation && (
          <Chip
            size='small'
            label={variation.label}
            color={
              variation.positive === null ? 'default' : variation.positive ? 'success' : 'error'
            }
            variant='tonal'
            icon={
              variation.positive === null ? undefined : (
                <i className={variation.positive ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} />
              )
            }
            sx={{ mt: 0.5 }}
          />
        )}
        {source && (
          <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mt: 1 }}>
            Fuente: {source}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default IndicatorCard
