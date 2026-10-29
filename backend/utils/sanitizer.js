/**
 * Utility functions for sanitizing sensitive data
 */

/**
 * Common sensitive field patterns
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /passwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /auth/i,
  /credential/i,
  /private/i,
  /ssn/i,
  /credit[_-]?card/i,
  /cvv/i,
  /pin/i
];

/**
 * Sanitize an object by masking sensitive fields
 */
function sanitizeObject(obj, rules = []) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = JSON.parse(JSON.stringify(obj)); // Deep clone
  
  // Apply custom rules
  rules.forEach(rule => {
    applySanitizationRule(sanitized, rule);
  });
  
  // Apply default patterns
  maskSensitiveFields(sanitized);
  
  return sanitized;
}

/**
 * Apply a single sanitization rule
 */
function applySanitizationRule(obj, rule) {
  const { field, action, replacement } = rule;
  const path = field.split('.');
  
  let target = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!target[path[i]]) return;
    target = target[path[i]];
  }
  
  const key = path[path.length - 1];
  if (target[key] === undefined) return;
  
  switch (action) {
    case 'remove':
      delete target[key];
      break;
    case 'mask':
      target[key] = maskValue(target[key]);
      break;
    case 'replace':
      target[key] = replacement || '***REPLACED***';
      break;
  }
}

/**
 * Mask sensitive fields based on patterns
 */
function maskSensitiveFields(obj, visited = new WeakSet()) {
  if (!obj || typeof obj !== 'object' || visited.has(obj)) return;
  visited.add(obj);
  
  if (Array.isArray(obj)) {
    obj.forEach(item => maskSensitiveFields(item, visited));
    return;
  }
  
  Object.keys(obj).forEach(key => {
    if (isSensitiveField(key)) {
      obj[key] = maskValue(obj[key]);
    } else if (typeof obj[key] === 'object') {
      maskSensitiveFields(obj[key], visited);
    }
  });
}

/**
 * Check if a field name is sensitive
 */
function isSensitiveField(fieldName) {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(fieldName));
}

/**
 * Mask a value appropriately
 */
function maskValue(value) {
  if (typeof value === 'string') {
    if (value.length <= 4) return '***';
    return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
  }
  return '***MASKED***';
}

/**
 * Generate sanitization rules from request/response
 */
function generateSanitizationRules(obj, path = '') {
  const rules = [];
  
  if (!obj || typeof obj !== 'object') return rules;
  
  Object.keys(obj).forEach(key => {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (isSensitiveField(key)) {
      rules.push({
        field: fullPath,
        action: 'mask',
        reason: 'Sensitive field detected'
      });
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      rules.push(...generateSanitizationRules(obj[key], fullPath));
    }
  });
  
  return rules;
}

/**
 * Sanitize headers
 */
function sanitizeHeaders(headers) {
  const sanitized = { ...headers };
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'api-key'
  ];
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = '***MASKED***';
    }
  });
  
  return sanitized;
}

module.exports = {
  sanitizeObject,
  sanitizeHeaders,
  generateSanitizationRules,
  isSensitiveField,
  maskValue
};
