import { BusinessController } from '$lib/server/business';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase }, params }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 5; // Negocios por página
	const offset = (page - 1) * limit;

	const { data, error } = await BusinessController(supabase).getBusinessInfo({
		businessLimit: limit,
		productLimit: 2,
		offset,
		business_id: params.id
	});

	if (error) {
		throw new Error('Error fetching store');
	}

	return {
		businessData: data,
		limit
	};
};
