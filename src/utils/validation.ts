import * as yup from 'yup'
import { CURRENCIES } from './constants'

// Deal form validation schema
export const dealFormSchema = yup.object({
  title: yup
    .string()
    .required('common.validation.required')
    .max(255, 'common.validation.max'),
  
  description: yup
    .string()
    .max(1000, 'common.validation.max'),
  
  value: yup
    .number()
    .min(0, 'common.validation.min')
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value)),
  
  currency: yup
    .string()
    .length(3, 'common.validation.length')
    .uppercase()
    .oneOf(
      CURRENCIES.map(c => c.code),
      'common.validation.valid_currency'
    )
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  status: yup
    .string()
    .required('common.validation.required')
    .oneOf(['open', 'won', 'lost', 'closed'], 'common.validation.valid_status'),
  
  pipeline_id: yup
    .number()
    .required('common.validation.required')
    .positive('common.validation.valid_pipeline'),
  
  stage_id: yup
    .number()
    .required('common.validation.required')
    .positive('common.validation.valid_stage'),
  
  owner_id: yup
    .number()
    .required('common.validation.required')
    .positive('common.validation.valid_owner'),
  
  contact_id: yup
    .number()
    .positive('common.validation.valid_contact')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  company_id: yup
    .number()
    .positive('common.validation.valid_company')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  expected_close_date: yup
    .date()
    .min(new Date(), 'common.validation.future_date')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  probability: yup
    .number()
    .min(0, 'common.validation.range')
    .max(100, 'common.validation.range')
    .integer('common.validation.integer')
    .required('Probability is required'),
  
  tags: yup
    .array()
    .of(yup.string().max(30, 'common.validation.max'))
    .max(10, 'common.validation.max_tags')
    .default([])
})

// Pipeline form validation schema
export const pipelineFormSchema = yup.object({
  name: yup
    .string()
    .required('common.validation.required')
    .max(255, 'common.validation.max'),
  
  description: yup
    .string()
    .max(1000, 'common.validation.max'),
  
  is_active: yup
    .boolean()
    .default(true)
})

// Stage form validation schema
export const stageFormSchema = yup.object({
  name: yup
    .string()
    .required('common.validation.required')
    .max(255, 'common.validation.max'),
  
  description: yup
    .string()
    .max(1000, 'common.validation.max'),
  
  pipeline_id: yup
    .number()
    .required('common.validation.required')
    .positive('common.validation.valid_pipeline'),
  
  order: yup
    .number()
    .min(1, 'common.validation.min')
    .integer('common.validation.integer')
    .required('Order is required'),
  
  color: yup
    .string()
    .required('common.validation.required')
    .matches(/^#[0-9A-F]{6}$/i, 'common.validation.hex_color'),
  
  is_active: yup
    .boolean()
    .default(true)
})

// Search validation schema
export const searchSchema = yup.object({
  search: yup
    .string()
    .max(255, 'common.validation.max')
})

// Filter validation schema
export const filterSchema = yup.object({
  status: yup
    .string()
    .oneOf(['all', 'open', 'won', 'lost', 'closed'], 'common.validation.valid_status'),
  
  pipeline_id: yup
    .number()
    .positive('common.validation.valid_pipeline')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  stage_id: yup
    .number()
    .positive('common.validation.valid_stage')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  owner_id: yup
    .number()
    .positive('common.validation.valid_owner')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  value_min: yup
    .number()
    .min(0, 'common.validation.min')
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value)),
  
  value_max: yup
    .number()
    .min(0, 'common.validation.min')
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value)),
  
  date_from: yup
    .date()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  date_to: yup
    .date()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  sort: yup
    .string()
    .oneOf([
      '-created_at',
      'created_at',
      'title',
      '-title',
      '-value',
      'value',
      '-expected_close_date',
      'expected_close_date',
      '-probability',
      'probability'
    ], 'common.validation.valid_sort'),
  
  page: yup
    .number()
    .min(1, 'common.validation.min')
    .integer('common.validation.integer'),
  
  per_page: yup
    .number()
    .oneOf([15, 25, 50, 100], 'common.validation.valid_per_page')
})

// Custom validation for stage dependency on pipeline
export const validateStagePipeline = (stageId: number, pipelineId: number, stages: any[]) => {
  if (!stageId || !pipelineId) return true
  
  const stage = stages.find(s => s.id === stageId)
  return stage && stage.pipeline_id === pipelineId
}

// Custom validation for date range
export const validateDateRange = (dateFrom: string, dateTo: string) => {
  if (!dateFrom || !dateTo) return true
  
  const from = new Date(dateFrom)
  const to = new Date(dateTo)
  
  return from <= to
}

// Custom validation for value range
export const validateValueRange = (valueMin: number, valueMax: number) => {
  if (valueMin === null || valueMax === null) return true
  
  return valueMin <= valueMax
}
