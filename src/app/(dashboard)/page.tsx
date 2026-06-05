import type { Metadata } from 'next'
import DashboardClient from '@views/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Resumen General — INEM Verde'
}

const Dashboard = () => <DashboardClient />

export default Dashboard
