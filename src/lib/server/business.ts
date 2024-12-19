import type { Database } from '$lib/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

export function BusinessController(supabase: SupabaseClient<Database>) {
	return {
		getBusinessResume: async (options: {
			productLimit: number;
			businessLimit: number;
			offset: number;
			owner_id?: string;
		}) => {
			const { productLimit, offset, businessLimit, owner_id } = options;

			let query = supabase
				.from('business')
				.select(
					`
        *,
        business_images:business_images(*),
        products:products(*, product_images:product_images(*)),
        reviews_summary:business_reviews_summary(*)
      `
				)
				.limit(productLimit, { foreignTable: 'products' }) // Limita a 5 productos por negocio
				.limit(1, { foreignTable: 'business_images' })
				.limit(1, { foreignTable: 'products.product_images' })
				.range(offset, offset + businessLimit - 1); // Paginación para los negocios

			if (owner_id) {
				query = query.eq('owner_id', owner_id);
			}

			const { data, error } = await query;
			if (error) {
				console.error(error);
				return { error };
			}

			return { data };
		},
		getBusinessInfo: async (options: {
			productLimit: number;
			businessLimit: number;
			offset: number;
			business_id: string;
			image_limit?: number;
		}) => {
			const { offset, businessLimit, business_id, image_limit } = options;

			let query = supabase
				.from('business')
				.select(
					`
        *,
        business_images:business_images(*),
        reviews_summary:business_reviews_summary(*)
      `
				)
				.range(offset, offset + businessLimit - 1); // Paginación para los negocios

			if (image_limit) {
				query = query.limit(image_limit, { foreignTable: 'business_images' });
			}
			if (business_id) {
				query = query.eq('id', business_id);
			}

			const { data, error } = await query;
			if (error) {
				console.error(error);
				return { error };
			}

			return { data };
		}
	};
}
