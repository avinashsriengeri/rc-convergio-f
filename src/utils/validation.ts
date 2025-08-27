import * as yup from 'yup'
import { CURRENCIES } from './constants'

// Deal form validation schema
export const dealFormSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title must be less than 255 characters'),
  
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  value: yup
    .number()
    .min(0, 'Value must be greater than or equal to 0')
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value)),
  
  currency: yup
    .string()
    .length(3, 'Currency must be exactly 3 characters')
    .uppercase()
    .oneOf(
      CURRENCIES.map(c => c.code),
      'Please select a valid currency'
    )
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['open', 'won', 'lost', 'closed'], 'Please select a valid status'),
  
  pipeline_id: yup
    .number()
    .required('Pipeline is required')
    .positive('Please select a valid pipeline'),
  
  stage_id: yup
    .number()
    .required('Stage is required')
    .positive('Please select a valid stage'),
  
  owner_id: yup
    .number()
    .required('Owner is required')
    .positive('Please select a valid owner'),
  
  contact_id: yup
    .number()
    .positive('Please select a valid contact')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  company_id: yup
    .number()
    .positive('Please select a valid company')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  expected_close_date: yup
    .date()
    .min(new Date(), 'Expected close date must be in the future')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  probability: yup
    .number()
    .min(0, 'Probability must be between 0 and 100')
    .max(100, 'Probability must be between 0 and 100')
    .integer('Probability must be a whole number')
    .required('Probability is required'),
  
  tags: yup
    .array()
    .of(yup.string().max(30, 'Each tag must be less than 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([])
})

// Pipeline form validation schema
export const pipelineFormSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .max(255, 'Name must be less than 255 characters'),
  
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  is_active: yup
    .boolean()
    .default(true)
})

// Stage form validation schema
export const stageFormSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .max(255, 'Name must be less than 255 characters'),
  
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  pipeline_id: yup
    .number()
    .required('Pipeline is required')
    .positive('Please select a valid pipeline'),
  
  order: yup
    .number()
    .min(1, 'Order must be at least 1')
    .integer('Order must be a whole number')
    .required('Order is required'),
  
  color: yup
    .string()
    .required('Color is required')
    .matches(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF0000)'),
  
  is_active: yup
    .boolean()
    .default(true)
})

// Search validation schema
export const searchSchema = yup.object({
  search: yup
    .string()
    .max(255, 'Search term must be less than 255 characters')
})

// Filter validation schema
export const filterSchema = yup.object({
  status: yup
    .string()
    .oneOf(['all', 'open', 'won', 'lost', 'closed'], 'Please select a valid status'),
  
  pipeline_id: yup
    .number()
    .positive('Please select a valid pipeline')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  stage_id: yup
    .number()
    .positive('Please select a valid stage')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  owner_id: yup
    .number()
    .positive('Please select a valid owner')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  
  value_min: yup
    .number()
    .min(0, 'Minimum value must be greater than or equal to 0')
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value)),
  
  value_max: yup
    .number()
    .min(0, 'Maximum value must be greater than or equal to 0')
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
    ], 'Please select a valid sort option'),
  
  page: yup
    .number()
    .min(1, 'Page must be at least 1')
    .integer('Page must be a whole number'),
  
  per_page: yup
    .number()
    .oneOf([15, 25, 50, 100], 'Please select a valid per page option')
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
