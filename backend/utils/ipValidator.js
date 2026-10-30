const url = require('url');
const net = require('net');

/**
 * Check if an IP address is private or reserved
 * Blocks:
 * - Loopback: 127.0.0.0/8, ::1
 * - Private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
 * - Link-local: 169.254.0.0/16
 * - Multicast: 224.0.0.0/4
 * - Reserved: 240.0.0.0/4
 * - IPv6: ::1, fc00::/7, fe80::/10, ff00::/8
 */
function isPrivateIP(ipAddress) {
  // IPv4 ranges
  const ipv4Ranges = [
    { min: '0.0.0.0', max: '0.255.255.255' },           // 0.0.0.0/8
    { min: '10.0.0.0', max: '10.255.255.255' },         // 10.0.0.0/8
    { min: '127.0.0.0', max: '127.255.255.255' },       // 127.0.0.0/8 (loopback)
    { min: '169.254.0.0', max: '169.254.255.255' },     // 169.254.0.0/16 (link-local)
    { min: '172.16.0.0', max: '172.31.255.255' },       // 172.16.0.0/12
    { min: '192.0.0.0', max: '192.0.0.255' },           // 192.0.0.0/24 (documentation)
    { min: '192.0.2.0', max: '192.0.2.255' },           // 192.0.2.0/24 (documentation)
    { min: '192.168.0.0', max: '192.168.255.255' },     // 192.168.0.0/16
    { min: '198.18.0.0', max: '198.19.255.255' },       // 198.18.0.0/15 (network benchmark)
    { min: '198.51.100.0', max: '198.51.100.255' },     // 198.51.100.0/24 (documentation)
    { min: '203.0.113.0', max: '203.0.113.255' },       // 203.0.113.0/24 (documentation)
    { min: '224.0.0.0', max: '239.255.255.255' },       // 224.0.0.0/4 (multicast)
    { min: '240.0.0.0', max: '255.255.255.255' }        // 240.0.0.0/4 (reserved)
  ];

  // IPv6 patterns
  const ipv6Patterns = [
    /^::1$/, // loopback
    /^fc[0-9a-f]{2}:/i, // unique local
    /^fe[89ab][0-9a-f]:/i, // link-local
    /^ff[0-9a-f]{2}:/i, // multicast
    /^::ffff:127\./, // IPv4-mapped loopback
    /^::ffff:(10|172\.1[6-9]|172\.2[0-9]|172\.3[01]|192\.168|127)\./i // IPv4-mapped private
  ];

  // Check IPv6
  if (ipAddress.includes(':')) {
    return ipv6Patterns.some(pattern => pattern.test(ipAddress));
  }

  // Check IPv4
  const parts = ipAddress.split('.');
  if (parts.length !== 4) {
    return false;
  }

  const ipNum = parts.reduce((acc, part) => {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      return null;
    }
    return acc * 256 + num;
  }, 0);

  if (ipNum === null) {
    return false;
  }

  // Check against ranges
  return ipv4Ranges.some(range => {
    const minNum = rangeToNumber(range.min);
    const maxNum = rangeToNumber(range.max);
    return ipNum >= minNum && ipNum <= maxNum;
  });
}

/**
 * Convert IP address string to numeric value
 */
function rangeToNumber(ip) {
  const parts = ip.split('.');
  return parts.reduce((acc, part) => {
    return acc * 256 + parseInt(part, 10);
  }, 0);
}

/**
 * Validate and check if a URL is safe to replay against
 * Returns { valid: boolean, error?: string }
 */
function validateTargetURL(targetUrl) {
  try {
    const parsedUrl = new url.URL(targetUrl);

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: 'Only HTTP and HTTPS protocols are allowed'
      };
    }

    const hostname = parsedUrl.hostname;

    // Validate hostname is a valid format
    if (!hostname || hostname.length === 0) {
      return {
        valid: false,
        error: 'Invalid hostname'
      };
    }

    // Check if hostname is an IP address
    if (net.isIP(hostname)) {
      const version = net.isIP(hostname);
      if (version === 4 || version === 6) {
        if (isPrivateIP(hostname)) {
          return {
            valid: false,
            error: 'Private/reserved IP addresses are not allowed'
          };
        }
      }
    }

    // Check for localhost variations
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return {
        valid: false,
        error: 'Localhost and loopback addresses are not allowed'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid URL: ${error.message}`
    };
  }
}

module.exports = {
  isPrivateIP,
  validateTargetURL
};
