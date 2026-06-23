import type { Metadata } from 'next'
import PraePage from '@/views/prae'

export const metadata: Metadata = {
  title: 'Gestión PRAE | INEM Verde',
  description: 'Indicadores del Proyecto Ambiental Escolar (PRAE)'
}

const Page = () => <PraePage />

export default Page
