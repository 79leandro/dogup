import type { SessionUser } from '$lib/server/auth';

export function hasPermission(user: SessionUser | undefined | null, permissionCode: string): boolean {
	// If no user context, no permission
	if (!user) return false;

	// If user has no profile, no permission
	if (!user.perfil) return false;

	// Super Admin always bypasses specific permission checks
	if (user.perfil.isAdmin) return true;

	// Check if the exact permission code is present in the user permissions array
	return user.perfil.permissoes.includes(permissionCode);
}
