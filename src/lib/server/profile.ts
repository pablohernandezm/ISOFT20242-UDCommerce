import type { Database } from '$lib/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

export function ProfileController(supabase: SupabaseClient<Database>) {
	return {
		getProfile: async (id: string) => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*, profile_picture:profile_pictures(image)')
				.eq('id', id)
				.single();

			if (error) {
				console.error(error);

				return { error };
			}

			return { data };
		}
	};
}
