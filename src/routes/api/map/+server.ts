import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BusinessController } from '$lib/server/business';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const { data, error } = await BusinessController(supabase).getBusinessLocations();

	if (error) {
		throw new Error(error.message);
	}

	return json({ success: true, data });
};
