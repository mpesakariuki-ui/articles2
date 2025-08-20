const ADMIN_EMAIL = 'jamexkarix583@gmail.com';

/**
 * Check if a user has admin access based on their email
 * @param userEmail The email address to check
 * @returns true if the user has admin access, false otherwise
 */
export function checkAdminAccess(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}