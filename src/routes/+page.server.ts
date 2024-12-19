import { BusinessController } from '$lib/server/business';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 5; // Negocios por página
	const offset = (page - 1) * limit;

	const { data, error } = await BusinessController(supabase).getBusinessResume({
		businessLimit: limit,
		productLimit: 10,
		offset
	});

	if (error) {
		throw new Error('Error fetching stores');
	}
	return {
		businessData: data,
		limit
	};
};
