import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error(error);
			return fail(error.status ?? 400, {
				error: error.message
			});
		}
	},
	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const first_name = formData.get('first_name') as string;
		const last_name = formData.get('last_name');

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name,
					last_name
				}
			}
		});

		if (error) {
			console.error(error);
			return fail(error.status ?? 400, {
				error: error.message
			});
		}
	}
} satisfies Actions;
