import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

type Props = {
  icon: string
  title: string
  description: string
  color?: string
}

const SectionHeader = ({ icon, title, description, color = 'var(--mui-palette-primary-main)' }: Props) => (
  <div className='mbe-6'>
    <div className='flex items-center gap-2 mbe-1'>
      <i className={`${icon} text-2xl`} style={{ color }} />
      <Typography variant='h6' color='text.primary' className='font-semibold'>
        {title}
      </Typography>
    </div>
    <Typography variant='body2' color='text.secondary' className='mbe-3'>
      {description}
    </Typography>
    <Divider />
  </div>
)

export default SectionHeader
