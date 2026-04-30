export const safeId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

const VALID_PROTOCOLS = ['http:', 'https:', 'ftp:', 'ftps:', 'mailto:'];
const hasValidProtocol = (url) => {
  try {
    const u = new URL(url);
    return VALID_PROTOCOLS.includes(u.protocol);
  } catch {
    return false;
  }
};

const trimmed = (v) => (typeof v === 'string' ? v.trim() : '');

export const validateCard = ({ label = '', url = '' }) => {
  const tLabel = trimmed(label);
  const tUrl = trimmed(url);
  if (!tLabel) return { valid: false, error: 'Label is required' };
  if (!tUrl) return { valid: false, error: 'URL is required' };
  if (!hasValidProtocol(tUrl)) return { valid: false, error: 'Invalid URL protocol' };
  return { valid: true, label: tLabel, url: tUrl };
};

export const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
