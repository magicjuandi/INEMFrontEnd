import type { Metadata } from 'next'
import EnergiaPage from '@/views/energia'

export const metadata: Metadata = {
  title: 'Energía Eléctrica | INEM Verde',
  description: 'Indicadores de consumo y costo energético'
}

const Page = () => <EnergiaPage />

export default Page
