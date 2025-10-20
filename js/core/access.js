// access.js - UI permission helpers
// exports: canEdit(user, resourceType), canDelete(user, resourceType)
export function canEdit(user, resourceType) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  // common users can only edit clients
  if (user.role === 'common' && resourceType === 'client') return true;
  return false;
}

export function canDelete(user, resourceType) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return false;
}
