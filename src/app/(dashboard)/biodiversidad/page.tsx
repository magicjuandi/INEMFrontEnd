import type { Metadata } from 'next'
import BiodiversidadPage from '@/views/biodiversidad'

export const metadata: Metadata = {
  title: 'Biodiversidad | INEM Verde',
  description: 'Indicadores de áreas verdes y biodiversidad'
}

const Page = () => <BiodiversidadPage />

export default Page
