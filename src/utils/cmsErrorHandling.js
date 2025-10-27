/**
 * CMS Error Handling Utilities
 * 
 * Provides consistent error handling and user-friendly messages for CMS operations
 */

// Error codes mapping
export const CMS_ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'CMS_UNAUTHORIZED',
  FORBIDDEN: 'CMS_FORBIDDEN',
  INVALID_TOKEN: 'CMS_INVALID_TOKEN',
  
  // Validation Errors
  VALIDATION_ERROR: 'CMS_VALIDATION_ERROR',
  REQUIRED_FIELD: 'CMS_REQUIRED_FIELD',
  INVALID_FORMAT: 'CMS_INVALID_FORMAT',
  DUPLICATE_SLUG: 'CMS_DUPLICATE_SLUG',
  
  // Resource Errors
  NOT_FOUND: 'CMS_NOT_FOUND',
  ALREADY_EXISTS: 'CMS_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'CMS_RESOURCE_CONFLICT',
  
  // Operation Errors
  SAVE_FAILED: 'CMS_SAVE_FAILED',
  PUBLISH_FAILED: 'CMS_PUBLISH_FAILED',
  DELETE_FAILED: 'CMS_DELETE_FAILED',
  UPLOAD_FAILED: 'CMS_UPLOAD_FAILED',
  
  // Content Errors
  CONTENT_TOO_LARGE: 'CMS_CONTENT_TOO_LARGE',
  INVALID_CONTENT: 'CMS_INVALID_CONTENT',
  MISSING_COMPONENTS: 'CMS_MISSING_COMPONENTS',
  
  // Network Errors
  NETWORK_ERROR: 'CMS_NETWORK_ERROR',
  TIMEOUT: 'CMS_TIMEOUT',
  SERVER_ERROR: 'CMS_SERVER_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'CMS_RATE_LIMIT_EXCEEDED',
  
  // Domain & SSL
  DOMAIN_VERIFICATION_FAILED: 'CMS_DOMAIN_VERIFICATION_FAILED',
  SSL_ERROR: 'CMS_SSL_ERROR',
  
  // SEO
  SEO_ANALYSIS_FAILED: 'CMS_SEO_ANALYSIS_FAILED',
  
  // A/B Testing
  AB_TEST_ACTIVE: 'CMS_AB_TEST_ACTIVE',
  AB_TEST_NO_VARIANTS: 'CMS_AB_TEST_NO_VARIANTS',
  
  // Memberships
  MEMBERSHIP_REQUIRED: 'CMS_MEMBERSHIP_REQUIRED',
  MEMBERSHIP_EXPIRED: 'CMS_MEMBERSHIP_EXPIRED',
  
  // Generic
  UNKNOWN_ERROR: 'CMS_UNKNOWN_ERROR',
};

// User-friendly error messages
const ERROR_MESSAGES = {
  [CMS_ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action. Please log in.',
  [CMS_ERROR_CODES.FORBIDDEN]: 'You do not have permission to access this resource.',
  [CMS_ERROR_CODES.INVALID_TOKEN]: 'Your session has expired. Please log in again.',
  
  [CMS_ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [CMS_ERROR_CODES.REQUIRED_FIELD]: 'This field is required.',
  [CMS_ERROR_CODES.INVALID_FORMAT]: 'The format of this field is invalid.',
  [CMS_ERROR_CODES.DUPLICATE_SLUG]: 'A page with this URL already exists. Please choose a different one.',
  
  [CMS_ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [CMS_ERROR_CODES.ALREADY_EXISTS]: 'A resource with this identifier already exists.',
  [CMS_ERROR_CODES.RESOURCE_CONFLICT]: 'This resource is currently being edited by another user.',
  
  [CMS_ERROR_CODES.SAVE_FAILED]: 'Failed to save changes. Please try again.',
  [CMS_ERROR_CODES.PUBLISH_FAILED]: 'Failed to publish page. Please try again.',
  [CMS_ERROR_CODES.DELETE_FAILED]: 'Failed to delete resource. Please try again.',
  [CMS_ERROR_CODES.UPLOAD_FAILED]: 'Failed to upload file. Please check the file size and format.',
  
  [CMS_ERROR_CODES.CONTENT_TOO_LARGE]: 'The content is too large. Maximum size is 2MB.',
  [CMS_ERROR_CODES.INVALID_CONTENT]: 'The content format is invalid.',
  [CMS_ERROR_CODES.MISSING_COMPONENTS]: 'Please add at least one component to your page.',
  
  [CMS_ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [CMS_ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [CMS_ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
  
  [CMS_ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment before trying again.',
  
  [CMS_ERROR_CODES.DOMAIN_VERIFICATION_FAILED]: 'Failed to verify domain. Please check your DNS settings.',
  [CMS_ERROR_CODES.SSL_ERROR]: 'SSL certificate error. Please contact support.',
  
  [CMS_ERROR_CODES.SEO_ANALYSIS_FAILED]: 'Failed to analyze SEO. Please try again.',
  
  [CMS_ERROR_CODES.AB_TEST_ACTIVE]: 'Cannot modify page while an A/B test is active.',
  [CMS_ERROR_CODES.AB_TEST_NO_VARIANTS]: 'Please add at least one variant to your A/B test.',
  
  [CMS_ERROR_CODES.MEMBERSHIP_REQUIRED]: 'This page requires a membership to access.',
  [CMS_ERROR_CODES.MEMBERSHIP_EXPIRED]: 'Your membership has expired. Please renew to continue.',
  
  [CMS_ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * CMS Error class
 */
export class CmsError extends Error {
  constructor(code, message, details = null, statusCode = null) {
    super(message || ERROR_MESSAGES[code] || ERROR_MESSAGES[CMS_ERROR_CODES.UNKNOWN_ERROR]);
    this.name = 'CmsError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }
}

/**
 * Parse API error response
 */
export function parseApiError(error) {
  // Network error
  if (!error.response) {
    return new CmsError(
      CMS_ERROR_CODES.NETWORK_ERROR,
      error.message || 'Network error occurred',
      null,
      0
    );
  }

  const { status, data } = error.response;
  
  // Rate limit exceeded
  if (status === 429) {
    return new CmsError(
      CMS_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.RATE_LIMIT_EXCEEDED],
      data,
      status
    );
  }
  
  // Unauthorized
  if (status === 401) {
    return new CmsError(
      CMS_ERROR_CODES.UNAUTHORIZED,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.UNAUTHORIZED],
      data,
      status
    );
  }
  
  // Forbidden
  if (status === 403) {
    return new CmsError(
      CMS_ERROR_CODES.FORBIDDEN,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.FORBIDDEN],
      data,
      status
    );
  }
  
  // Not found
  if (status === 404) {
    return new CmsError(
      CMS_ERROR_CODES.NOT_FOUND,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.NOT_FOUND],
      data,
      status
    );
  }
  
  // Validation error
  if (status === 422) {
    return new CmsError(
      CMS_ERROR_CODES.VALIDATION_ERROR,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.VALIDATION_ERROR],
      data?.errors || data?.details,
      status
    );
  }
  
  // Server error
  if (status >= 500) {
    return new CmsError(
      CMS_ERROR_CODES.SERVER_ERROR,
      data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.SERVER_ERROR],
      data,
      status
    );
  }
  
  // Unknown error
  return new CmsError(
    data?.code || CMS_ERROR_CODES.UNKNOWN_ERROR,
    data?.message || ERROR_MESSAGES[CMS_ERROR_CODES.UNKNOWN_ERROR],
    data,
    status
  );
}

/**
 * Handle CMS operation error
 */
export function handleCmsError(error, context = '') {
  const cmsError = error instanceof CmsError ? error : parseApiError(error);
  
  console.error(`[CMS Error] ${context}:`, {
    code: cmsError.code,
    message: cmsError.message,
    details: cmsError.details,
    statusCode: cmsError.statusCode,
    timestamp: cmsError.timestamp
  });
  
  return cmsError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error) {
  if (error instanceof CmsError) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES[CMS_ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Show error notification
 */
export function showCmsError(error, notificationFn = alert) {
  const message = getErrorMessage(error);
  notificationFn(message);
}

/**
 * Validation helpers
 */
export const CmsValidators = {
  /**
   * Validate page title
   */
  validateTitle(title) {
    if (!title || title.trim().length === 0) {
      throw new CmsError(
        CMS_ERROR_CODES.REQUIRED_FIELD,
        'Page title is required'
      );
    }
    if (title.length > 255) {
      throw new CmsError(
        CMS_ERROR_CODES.INVALID_FORMAT,
        'Page title must be less than 255 characters'
      );
    }
    return true;
  },

  /**
   * Validate page slug
   */
  validateSlug(slug) {
    if (!slug || slug.trim().length === 0) {
      throw new CmsError(
        CMS_ERROR_CODES.REQUIRED_FIELD,
        'Page slug is required'
      );
    }
    
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      throw new CmsError(
        CMS_ERROR_CODES.INVALID_FORMAT,
        'Page slug must contain only lowercase letters, numbers, and hyphens'
      );
    }
    return true;
  },

  /**
   * Validate page content
   */
  validateContent(content) {
    if (!content) {
      throw new CmsError(
        CMS_ERROR_CODES.REQUIRED_FIELD,
        'Page content is required'
      );
    }
    
    if (Array.isArray(content) && content.length === 0) {
      throw new CmsError(
        CMS_ERROR_CODES.MISSING_COMPONENTS,
        'Please add at least one component to your page'
      );
    }
    
    // Check content size (2MB limit)
    const contentSize = new Blob([JSON.stringify(content)]).size;
    if (contentSize > 2 * 1024 * 1024) {
      throw new CmsError(
        CMS_ERROR_CODES.CONTENT_TOO_LARGE,
        'Page content is too large. Maximum size is 2MB'
      );
    }
    
    return true;
  },

  /**
   * Validate file upload
   */
  validateFile(file, maxSize = 10 * 1024 * 1024, allowedTypes = []) {
    if (!file) {
      throw new CmsError(
        CMS_ERROR_CODES.REQUIRED_FIELD,
        'File is required'
      );
    }
    
    if (file.size > maxSize) {
      throw new CmsError(
        CMS_ERROR_CODES.UPLOAD_FAILED,
        `File size must be less than ${maxSize / 1024 / 1024}MB`
      );
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new CmsError(
        CMS_ERROR_CODES.UPLOAD_FAILED,
        `File type must be one of: ${allowedTypes.join(', ')}`
      );
    }
    
    return true;
  },

  /**
   * Validate SEO metadata
   */
  validateSeo(seoData) {
    if (seoData.seo_title && seoData.seo_title.length > 60) {
      console.warn('[CMS] SEO title should be less than 60 characters for optimal display');
    }
    
    if (seoData.seo_description && seoData.seo_description.length > 160) {
      console.warn('[CMS] SEO description should be less than 160 characters for optimal display');
    }
    
    return true;
  }
};

/**
 * Retry helper for failed requests
 */
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation errors or 4xx errors
      if (error instanceof CmsError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw handleCmsError(lastError, 'Retry failed');
}

/**
 * Safe operation wrapper
 */
export async function safeCmsOperation(operation, errorContext = '', showNotification = true) {
  try {
    return await operation();
  } catch (error) {
    const cmsError = handleCmsError(error, errorContext);
    
    if (showNotification) {
      showCmsError(cmsError);
    }
    
    throw cmsError;
  }
}

export default {
  CmsError,
  CMS_ERROR_CODES,
  parseApiError,
  handleCmsError,
  getErrorMessage,
  showCmsError,
  CmsValidators,
  retryOperation,
  safeCmsOperation
};

