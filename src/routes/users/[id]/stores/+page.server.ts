import { BusinessController } from '$lib/server/business';
import { ProfileController } from '$lib/server/profile';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase }, params }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 5; // Negocios por página
	const offset = (page - 1) * limit;

	const { data, error } = await BusinessController(supabase).getBusinessResume({
		businessLimit: limit,
		productLimit: 2,
		offset,
		owner_id: params.id
	});

	if (error) {
		throw new Error('Error fetching stores');
	}

	const { data: profile, error: profileError } = await ProfileController(supabase).getProfile(
		params.id
	);
	if (error) {
		throw new Error('Error fetching profile');
	}

	return {
		businessData: data,
		profile: profile,
		limit
	};
};
