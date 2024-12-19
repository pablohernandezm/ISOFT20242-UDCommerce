import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { loginSchema, registerSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { ProfileController } from '$lib/server/profile';

export const load: LayoutServerLoad = async ({
	locals: { safeGetSession, user, supabase },
	cookies
}) => {
	const { session } = await safeGetSession();

	if (session) {
		const { data, error } = ProfileController(supabase).getProfile(session.user.id);
	}
	return {
		session,
		cookies: cookies.getAll(),
		loginForm: await superValidate(zod(loginSchema)),
		registerForm: await superValidate(zod(registerSchema))
	};
};
