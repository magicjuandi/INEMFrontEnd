import type { Metadata } from 'next'
import ResiduosPage from '@/views/residuos'

export const metadata: Metadata = {
  title: 'Residuos | INEM Verde',
  description: 'Indicadores de gestión de residuos sólidos'
}

const Page = () => <ResiduosPage />

export default Page
