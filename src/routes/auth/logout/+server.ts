import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase }, url }) => {
	await supabase.auth.signOut();

	const redirectTo = url.searchParams.get('redirectTo') || '/';

	throw redirect(303, redirectTo);
};
