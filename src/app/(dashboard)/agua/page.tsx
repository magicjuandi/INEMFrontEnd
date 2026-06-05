import type { Metadata } from 'next'
import AguaPage from '@/views/agua'

export const metadata: Metadata = {
  title: 'Agua | INEM Verde',
  description: 'Indicadores de consumo hídrico'
}

const Page = () => <AguaPage />

export default Page
