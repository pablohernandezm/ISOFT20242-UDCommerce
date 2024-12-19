import { BusinessController } from '$lib/server/business';
import { ProfileController } from '$lib/server/profile';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase }, params }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 5; // Negocios por página
	const offset = (page - 1) * limit;

	const { data, error } = await BusinessController(supabase).getBusinessResume({
		businessLimit: limit,
		productLimit: 100,
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

export const actions: Actions = {
	profile: async ({ locals: { supabase }, request, params }) => {
		const formData = await request.formData();

		const first_name = formData.get('first_name') as string;
		const last_name = formData.get('last_name') as string;

		if (!first_name || !last_name) {
			return fail(400, { message: 'Al menos uno de tus nombres debe estar registrado.' });
		}

		const { error } = await supabase
			.from('profiles')
			.update({ first_name, last_name })
			.eq('id', params.id);

		if (error) {
			console.error(error);
			return fail(400, { error });
		}

		return {
			success: true
		};
	}
} satisfies Actions;
