import { BusinessController } from '$lib/server/business';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase }, params }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 1; // Negocios por página
	const offset = (page - 1) * limit;

	const { data, error } = await BusinessController(supabase).getBusinessInfo({
		business_id: params.id
	});

	if (!data) {
		throw new Error('Sin datos del negocio.');
	}

	if (error) {
		throw new Error('Error fetching store');
	}

	const { data: pdata, error: perror } = await BusinessController(supabase).getBusinessProducts(
		data.id
	);
	if (perror) {
		return {
			error: perror
		};
	}

	return {
		businessData: data,
		productData: pdata
	};
};
