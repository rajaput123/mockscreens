/**
 * Data masking utilities for VIP Devotee Management
 * Masks sensitive information to protect privacy
 */

/**
 * Mask a name (shows first letter and last letter, masks middle)
 */
export function maskName(name: string): string {
  if (!name || name.length <= 2) return '***';
  if (name.length <= 4) {
    return name[0] + '***' + name[name.length - 1];
  }
  return name[0] + '***' + name[name.length - 1];
}

/**
 * Mask a phone number (shows last 4 digits)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '***-***-****';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '***-***-****';
  const last4 = cleaned.slice(-4);
  return `***-***-${last4}`;
}

/**
 * Mask an email (shows first letter and domain)
 */
export function maskEmail(email: string): string {
  if (!email) return '***@***.***';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***.***';
  if (local.length <= 1) {
    return local[0] + '***@' + domain;
  }
  return local[0] + '***@' + domain;
}

/**
 * Mask an address (shows only city)
 */
export function maskAddress(address: string): string {
  if (!address) return '***';
  // Simple masking - in production, extract city only
  const parts = address.split(',');
  if (parts.length > 1) {
    return '***, ' + parts[parts.length - 1].trim();
  }
  return '***';
}

/**
 * Check if current user has permission to view unmasked VIP data
 */
export function canViewUnmasked(): boolean {
  // TODO: Replace with actual RBAC check
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('user_role');
    return role === 'temple_administrator' || role === 'operations_manager';
  }
  return false;
}

