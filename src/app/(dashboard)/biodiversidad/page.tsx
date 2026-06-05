import type { Metadata } from 'next'
import BiodiversidadPage from '@/views/biodiversidad'

export const metadata: Metadata = {
  title: 'Biodiversidad y PRAE | INEM Verde',
  description: 'Indicadores de áreas verdes, biodiversidad y gestión PRAE'
}

const Page = () => <BiodiversidadPage />

export default Page
