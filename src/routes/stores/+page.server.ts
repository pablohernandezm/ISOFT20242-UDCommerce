import { BusinessController } from '$lib/server/business';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ locals: { supabase, user }, request, params }) => {
		if (!user) {
			return fail(400, { message: 'Debes iniciar sesión para crear un negocio,' });
		}

		const formData = await request.formData();

		const name = formData.get('name') as string;

		if (!name || !(name.length > 0)) {
			return fail(400, { name_error: 'El nombre es requerido.' });
		}
		const description = formData.get('description') as string;
		const location = formData.get('location') as string;
		const phone = formData.get('phone') as string;

		const { data, error } = await BusinessController(supabase).createBusiness({
			owner_id: user?.id,
			name,
			description,
			location,
			phone
		});

		if (error) {
			console.error(error);
			return fail(400, { error });
		}

		throw redirect(303, `/stores/${data.id}`);
	}
} satisfies Actions;
