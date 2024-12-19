import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const formData = await request.formData();
	console.info(formData);
	const action = formData.get('action') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	try {
		if (action === 'login') {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw new Error(error.message);

			console.info('not here');
			return json({ success: true });
		}

		if (action === 'register') {
			const confirm_password = formData.get('confirm_password') as string;
			const first_name = formData.get('first_name') as string;
			const last_name = formData.get('last_name') as string;

			if (password !== confirm_password) {
				throw new Error('Las contraseñas no coinciden.');
			}

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { first_name, last_name } }
			});
			if (error) throw new Error(error.message);

			return json({ success: true });
		}

		throw new Error('Invalid action');
	} catch (error: any) {
		return json({ success: false, error: error.message }, { status: 400 });
	}
};
