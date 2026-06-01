'use client'

import { useState, useMemo } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

import { emptyRecord, computeIndicators, formatVariation, formatCurrency, formatNumber, MONTHS } from '@/utils/indicators'
import type { EnvironmentalMonthlyRecord } from '@/types/environmental'
import IndicatorCard from './IndicatorCard'
import SectionHeader from './SectionHeader'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

const NumField = ({
  label,
  value,
  onChange,
  unit,
  helperText,
  integer = false
}: {
  label: string
  value: number | null
  onChange: (v: number | null) => void
  unit?: string
  helperText?: string
  integer?: boolean
}) => (
  <TextField
    fullWidth
    type='number'
    label={label}
    value={value ?? ''}
    onChange={e => {
      const raw = e.target.value
      if (raw === '') return onChange(null)
      const n = integer ? parseInt(raw, 10) : parseFloat(raw)
      if (!isNaN(n) && n >= 0) onChange(n)
    }}
    inputProps={{ min: 0, step: integer ? 1 : 0.01 }}
    helperText={helperText}
    InputProps={
      unit
        ? {
            endAdornment: (
              <InputAdornment position='end'>
                <Typography variant='caption' color='text.secondary'>
                  {unit}
                </Typography>
              </InputAdornment>
            )
          }
        : undefined
    }
  />
)

const CurrencyField = ({
  label,
  value,
  onChange,
  helperText
}: {
  label: string
  value: number | null
  onChange: (v: number | null) => void
  helperText?: string
}) => (
  <TextField
    fullWidth
    type='number'
    label={label}
    value={value ?? ''}
    onChange={e => {
      const raw = e.target.value
      if (raw === '') return onChange(null)
      const n = parseFloat(raw)
      if (!isNaN(n) && n >= 0) onChange(n)
    }}
    inputProps={{ min: 0, step: 1 }}
    helperText={helperText}
    InputProps={{
      startAdornment: (
        <InputAdornment position='start'>
          <Typography variant='caption' color='text.secondary'>
            $
          </Typography>
        </InputAdornment>
      )
    }}
  />
)

export default function EncuestasMensuales() {
  const [tab, setTab] = useState(0)
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [saved, setSaved] = useState(false)
  const [record, setRecord] = useState<EnvironmentalMonthlyRecord>(() => emptyRecord(currentYear, currentMonth))

  const indicators = useMemo(() => computeIndicators(record, null), [record])

  const updateEnergy = (field: keyof typeof record.energy, value: number | null) =>
    setRecord(r => ({ ...r, energy: { ...r.energy, [field]: value } }))

  const updateWater = (field: keyof typeof record.water, value: number | null) =>
    setRecord(r => ({ ...r, water: { ...r.water, [field]: value } }))

  const updateWaste = (field: keyof typeof record.waste, value: number | null) =>
    setRecord(r => ({ ...r, waste: { ...r.waste, [field]: value } }))

  const updateGreen = (field: keyof typeof record.greenAreas, value: number | null) =>
    setRecord(r => ({ ...r, greenAreas: { ...r.greenAreas, [field]: value } }))

  const updatePrae = (field: keyof typeof record.prae, value: number | null) =>
    setRecord(r => ({ ...r, prae: { ...r.prae, [field]: value } }))

  const handlePeriodChange = (newYear: number, newMonth: number) => {
    setYear(newYear)
    setMonth(newMonth)
    setRecord(emptyRecord(newYear, newMonth))
    setSaved(false)
  }

  const handleSave = (status: 'draft' | 'submitted') => {
    setRecord(r => ({ ...r, status }))
    setSaved(true)
  }

  const energyVar = formatVariation(indicators.energy.variationPct)
  const waterVar = formatVariation(indicators.water.variationPct)

  const tabs = [
    { label: 'Energía', icon: 'ri-flashlight-line' },
    { label: 'Agua', icon: 'ri-drop-line' },
    { label: 'Residuos', icon: 'ri-recycle-line' },
    { label: 'Áreas verdes', icon: 'ri-leaf-line' },
    { label: 'PRAE', icon: 'ri-book-open-line' }
  ]

  return (
    <Grid container spacing={6}>
      {/* Header de período */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Registro mensual de indicadores ambientales'
            subheader='Diligencie los datos del período seleccionado. Los indicadores se calculan automáticamente.'
            action={
              <div className='flex items-center gap-3 flex-wrap'>
                <TextField
                  select
                  size='small'
                  label='Mes'
                  value={month}
                  onChange={e => handlePeriodChange(year, Number(e.target.value))}
                  sx={{ minWidth: 130 }}
                >
                  {MONTHS.map((m, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size='small'
                  label='Año'
                  value={year}
                  onChange={e => handlePeriodChange(Number(e.target.value), month)}
                  sx={{ minWidth: 100 }}
                >
                  {YEARS.map(y => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            }
          />
        </Card>
      </Grid>

      {saved && (
        <Grid item xs={12}>
          <Alert severity='success' onClose={() => setSaved(false)}>
            Registro de {MONTHS[month - 1]} {year} guardado como{' '}
            {record.status === 'draft' ? 'borrador' : 'enviado'} correctamente.
          </Alert>
        </Grid>
      )}

      {/* Tabs de secciones */}
      <Grid item xs={12}>
        <Card>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant='scrollable'
            scrollButtons='auto'
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            {tabs.map((t, i) => (
              <Tab
                key={i}
                label={t.label}
                icon={<i className={`${t.icon} text-lg`} />}
                iconPosition='start'
              />
            ))}
          </Tabs>

          <CardContent>
            {/* ── ENERGÍA ── */}
            {tab === 0 && (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <SectionHeader
                    icon='ri-flashlight-line'
                    title='Energía eléctrica'
                    description='Registre los datos del recibo de energía eléctrica del mes. Ambos campos son obligatorios para calcular los indicadores.'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumField
                    label='¿Cuál fue el consumo total de energía eléctrica registrado durante el mes actual en kWh?'
                    value={record.energy.consumptionKwh}
                    onChange={v => updateEnergy('consumptionKwh', v)}
                    unit='kWh'
                    helperText='Fuente: Factura de energía eléctrica · Frecuencia: mensual'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CurrencyField
                    label='¿Cuál fue el costo total asociado al consumo de energía eléctrica durante el mes actual?'
                    value={record.energy.costAmount}
                    onChange={v => updateEnergy('costAmount', v)}
                    helperText='Fuente: Factura de energía eléctrica · Frecuencia: mensual'
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      Indicadores calculados
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-flashlight-line'
                    label='Consumo mensual de energía'
                    value={formatNumber(indicators.energy.consumptionKwh)}
                    unit='kWh'
                    source='Factura de energía'
                    color='warning'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-money-dollar-circle-line'
                    label='Costo total del recibo'
                    value={formatCurrency(indicators.energy.costAmount)}
                    source='Factura de energía'
                    color='secondary'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-bar-chart-line'
                    label='Variación vs mes anterior'
                    value={energyVar.label}
                    variation={indicators.energy.variationPct !== null ? energyVar : null}
                    source='Cálculo automático'
                    color={
                      energyVar.positive === null ? 'secondary' : energyVar.positive ? 'success' : 'error'
                    }
                  />
                </Grid>
              </Grid>
            )}

            {/* ── AGUA ── */}
            {tab === 1 && (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <SectionHeader
                    icon='ri-drop-line'
                    title='Agua y acueducto'
                    description='Registre los datos del recibo de acueducto y alcantarillado del mes.'
                    color='var(--mui-palette-secondary-main)'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumField
                    label='¿Cuál fue el consumo total de agua potable registrado durante el mes actual en m³?'
                    value={record.water.consumptionM3}
                    onChange={v => updateWater('consumptionM3', v)}
                    unit='m³'
                    helperText='Fuente: Factura de acueducto · Frecuencia: mensual'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CurrencyField
                    label='¿Cuál fue el costo total del servicio de acueducto y alcantarillado correspondiente al mes actual?'
                    value={record.water.costAmount}
                    onChange={v => updateWater('costAmount', v)}
                    helperText='Fuente: Factura de acueducto · Frecuencia: mensual'
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      Indicadores calculados
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-drop-line'
                    label='Consumo mensual de acueducto'
                    value={formatNumber(indicators.water.consumptionM3)}
                    unit='m³'
                    source='Factura de acueducto'
                    color='secondary'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-money-dollar-circle-line'
                    label='Costo total del recibo'
                    value={formatCurrency(indicators.water.costAmount)}
                    source='Factura de acueducto'
                    color='info'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-bar-chart-line'
                    label='Variación vs mes anterior'
                    value={waterVar.label}
                    variation={indicators.water.variationPct !== null ? waterVar : null}
                    source='Cálculo automático'
                    color={
                      waterVar.positive === null ? 'secondary' : waterVar.positive ? 'success' : 'error'
                    }
                  />
                </Grid>
              </Grid>
            )}

            {/* ── RESIDUOS ── */}
            {tab === 2 && (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <SectionHeader
                    icon='ri-recycle-line'
                    title='Residuos sólidos'
                    description='Registre las cantidades de residuos generados y aprovechados durante el mes. El total se calcula automáticamente.'
                    color='var(--mui-palette-warning-main)'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuál fue la cantidad total de residuos orgánicos generados durante el mes en kg?'
                    value={record.waste.organicKg}
                    onChange={v => updateWaste('organicKg', v)}
                    unit='kg'
                    helperText='Fuente: Pesaje institucional · Frecuencia: mensual'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuál fue la cantidad total de residuos aprovechables recuperados durante el mes en kg?'
                    value={record.waste.recoveredKg}
                    onChange={v => updateWaste('recoveredKg', v)}
                    unit='kg'
                    helperText='Fuente: Pesaje institucional / Registros PRAE · Frecuencia: mensual'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuál fue la cantidad total de residuos no aprovechables generados durante el mes en kg?'
                    value={record.waste.nonRecoveredKg}
                    onChange={v => updateWaste('nonRecoveredKg', v)}
                    unit='kg'
                    helperText='Fuente: Pesaje institucional · Frecuencia: mensual'
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      Indicadores calculados
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <IndicatorCard
                    icon='ri-plant-line'
                    label='Residuos orgánicos'
                    value={formatNumber(indicators.waste.organicKg)}
                    unit='kg'
                    source='Pesaje institucional'
                    color='success'
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <IndicatorCard
                    icon='ri-recycle-line'
                    label='Residuos recuperados'
                    value={formatNumber(indicators.waste.recoveredKg)}
                    unit='kg'
                    source='Pesaje / Registros PRAE'
                    color='primary'
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <IndicatorCard
                    icon='ri-delete-bin-line'
                    label='Residuos no recuperados'
                    value={formatNumber(indicators.waste.nonRecoveredKg)}
                    unit='kg'
                    source='Pesaje institucional'
                    color='error'
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <IndicatorCard
                    icon='ri-scales-line'
                    label='Total de residuos'
                    value={formatNumber(indicators.waste.totalKg)}
                    unit='kg'
                    source='Cálculo automático'
                    color='warning'
                  />
                </Grid>
              </Grid>
            )}

            {/* ── ÁREAS VERDES ── */}
            {tab === 3 && (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <SectionHeader
                    icon='ri-leaf-line'
                    title='Áreas verdes y biodiversidad'
                    description='Registre las intervenciones ambientales realizadas durante el mes en espacios verdes de la institución.'
                    color='var(--mui-palette-success-main)'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuál fue el área total de zonas verdes intervenidas y mantenidas durante el mes en m²?'
                    value={record.greenAreas.maintainedAreaM2}
                    onChange={v => updateGreen('maintainedAreaM2', v)}
                    unit='m²'
                    helperText='Fuente: Registro de mantenimiento · Frecuencia: mensual'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuántos árboles fueron sembrados durante el mes como parte de las actividades ambientales institucionales?'
                    value={record.greenAreas.plantedTreesCount}
                    onChange={v => updateGreen('plantedTreesCount', v)}
                    unit='árboles'
                    helperText='Fuente: Registro PRAE · Frecuencia: mensual'
                    integer
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuántas jornadas de limpieza y mantenimiento ambiental fueron ejecutadas durante el mes?'
                    value={record.greenAreas.cleanupDaysCount}
                    onChange={v => updateGreen('cleanupDaysCount', v)}
                    unit='jornadas'
                    helperText='Fuente: Actas y evidencias fotográficas · Frecuencia: mensual'
                    integer
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      Indicadores calculados
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-map-pin-line'
                    label='Zonas verdes mantenidas'
                    value={formatNumber(indicators.greenAreas.maintainedAreaM2)}
                    unit='m²'
                    source='Registro de mantenimiento'
                    color='success'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-tree-line'
                    label='Árboles sembrados'
                    value={formatNumber(indicators.greenAreas.plantedTreesCount, 0)}
                    unit='árboles'
                    source='Registro PRAE'
                    color='primary'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-community-line'
                    label='Jornadas de limpieza'
                    value={formatNumber(indicators.greenAreas.cleanupDaysCount, 0)}
                    unit='jornadas'
                    source='Actas y evidencias fotográficas'
                    color='secondary'
                  />
                </Grid>
              </Grid>
            )}

            {/* ── PRAE ── */}
            {tab === 4 && (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <SectionHeader
                    icon='ri-book-open-line'
                    title='Gestión del PRAE'
                    description='Consolide la ejecución mensual del Proyecto Ambiental Escolar y las actividades del Comité GIRE.'
                    color='var(--mui-palette-info-main)'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuántas actividades del cronograma PRAE fueron ejecutadas durante el mes?'
                    value={record.prae.executedActivitiesCount}
                    onChange={v => updatePrae('executedActivitiesCount', v)}
                    unit='actividades'
                    helperText='Fuente: Informes PRAE · Frecuencia: mensual'
                    integer
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuántos estudiantes participaron en las actividades ambientales desarrolladas durante el mes?'
                    value={record.prae.participatingStudentsCount}
                    onChange={v => updatePrae('participatingStudentsCount', v)}
                    unit='estudiantes'
                    helperText='Fuente: Listados de asistencia · Frecuencia: mensual'
                    integer
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumField
                    label='¿Cuántos simulacros institucionales se realizaron durante el mes académico?'
                    value={record.prae.drillsCount}
                    onChange={v => updatePrae('drillsCount', v)}
                    unit='simulacros'
                    helperText='Fuente: Actas del Comité GIRE · Frecuencia: mensual'
                    integer
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      Indicadores calculados
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-calendar-check-line'
                    label='Actividades PRAE ejecutadas'
                    value={formatNumber(indicators.prae.executedActivitiesCount, 0)}
                    unit='actividades'
                    source='Informes PRAE'
                    color='info'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-group-line'
                    label='Estudiantes participantes'
                    value={formatNumber(indicators.prae.participatingStudentsCount, 0)}
                    unit='estudiantes'
                    source='Listados de asistencia'
                    color='primary'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <IndicatorCard
                    icon='ri-alarm-warning-line'
                    label='Simulacros realizados'
                    value={formatNumber(indicators.prae.drillsCount, 0)}
                    unit='simulacros'
                    source='Actas Comité GIRE'
                    color='warning'
                  />
                </Grid>
              </Grid>
            )}

            {/* Acciones */}
            <div className='flex items-center gap-3 flex-wrap mbs-8'>
              {tab > 0 && (
                <Button variant='outlined' onClick={() => setTab(t => t - 1)} startIcon={<i className='ri-arrow-left-line' />}>
                  Anterior
                </Button>
              )}
              {tab < 4 && (
                <Button variant='contained' onClick={() => setTab(t => t + 1)} endIcon={<i className='ri-arrow-right-line' />}>
                  Siguiente
                </Button>
              )}
              <div style={{ flex: 1 }} />
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => handleSave('draft')}
                startIcon={<i className='ri-save-line' />}
              >
                Guardar borrador
              </Button>
              {tab === 4 && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleSave('submitted')}
                  startIcon={<i className='ri-send-plane-line' />}
                >
                  Enviar registro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
