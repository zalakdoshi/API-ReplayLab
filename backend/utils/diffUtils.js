/**
 * Utility functions for comparing API responses
 */

const deepDiff = require('deep-diff');

/**
 * Compare two JSON objects and return structured differences
 */
function compareResponses(expected, actual) {
  const differences = deepDiff(expected, actual) || [];
  
  return differences.map(diff => ({
    path: diff.path ? diff.path.join('.') : 'root',
    type: mapDiffKind(diff.kind),
    expectedValue: diff.lhs,
    actualValue: diff.rhs,
    index: diff.index
  }));
}

/**
 * Map deep-diff kinds to readable types
 */
function mapDiffKind(kind) {
  const kindMap = {
    'N': 'added',      // New value
    'D': 'removed',    // Deleted value
    'E': 'modified',   // Edited value
    'A': 'modified'    // Array change
  };
  return kindMap[kind] || 'unknown';
}

/**
 * Calculate similarity score between two objects (0-100)
 */
function calculateSimilarityScore(expected, actual) {
  const differences = deepDiff(expected, actual) || [];
  
  if (differences.length === 0) return 100;
  
  // Count total fields
  const totalFields = countFields(expected);
  if (totalFields === 0) return 100;
  
  // Calculate score based on differences
  const diffWeight = Math.min(differences.length * 5, 50);
  const score = Math.max(0, 100 - diffWeight);
  
  return Math.round(score);
}

/**
 * Count total fields in an object recursively
 */
function countFields(obj, count = 0) {
  if (obj === null || obj === undefined) return count;
  
  if (typeof obj !== 'object') return count + 1;
  
  if (Array.isArray(obj)) {
    return obj.reduce((acc, item) => acc + countFields(item), count);
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    return acc + countFields(obj[key], 1);
  }, count);
}

/**
 * Detect regression severity based on differences
 */
function detectRegressionSeverity(statusCodeMatch, differences, criticalFields = []) {
  let severity = 'none';
  const reasons = [];
  
  // Check status code
  if (!statusCodeMatch) {
    severity = 'high';
    reasons.push('Status code mismatch');
  }
  
  // Check for removed fields
  const removedFields = differences.filter(d => d.type === 'removed');
  if (removedFields.length > 0) {
    severity = severity === 'none' ? 'medium' : severity;
    reasons.push(`${removedFields.length} field(s) removed`);
  }
  
  // Check for type changes
  const typeChanges = differences.filter(d => d.type === 'modified' && 
    typeof d.expectedValue !== typeof d.actualValue);
  if (typeChanges.length > 0) {
    severity = 'medium';
    reasons.push(`${typeChanges.length} field(s) changed type`);
  }
  
  // Check critical fields
  const criticalChanges = differences.filter(d => 
    criticalFields.some(field => d.path.includes(field))
  );
  if (criticalChanges.length > 0) {
    severity = 'critical';
    reasons.push('Critical business fields changed');
  }
  
  return {
    severity,
    reasons,
    detected: severity !== 'none'
  };
}

/**
 * Format differences for human-readable output
 */
function formatDifferences(differences) {
  return differences.map(diff => {
    let description = '';
    
    switch (diff.type) {
      case 'added':
        description = `Added: ${diff.path} = ${JSON.stringify(diff.actualValue)}`;
        break;
      case 'removed':
        description = `Removed: ${diff.path} (was ${JSON.stringify(diff.expectedValue)})`;
        break;
      case 'modified':
        description = `Modified: ${diff.path} from ${JSON.stringify(diff.expectedValue)} to ${JSON.stringify(diff.actualValue)}`;
        break;
      default:
        description = `Changed: ${diff.path}`;
    }
    
    return {
      ...diff,
      description
    };
  });
}

module.exports = {
  compareResponses,
  calculateSimilarityScore,
  detectRegressionSeverity,
  formatDifferences,
  countFields
};
