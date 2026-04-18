// Layout server load - this file only runs on the server
import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/auth';

export const load: LayoutServerLoad = async (event) => {
	const user = await getSession(event);

	return {
		user: user
			? {
					id: user.id,
					email: user.email,
					nome: user.nome,
					empresaId: user.empresaId,
					empresaNome: user.empresaNome,
					empresaSlug: user.empresaSlug
				}
			: null
	};
};
