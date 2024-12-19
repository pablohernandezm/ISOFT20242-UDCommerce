import type { Database, TablesInsert } from '$lib/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';
import { POST } from '../../routes/auth/+server';

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
		getBusinessInfo: async (options: { business_id: string; image_limit?: number }) => {
			const { business_id, image_limit } = options;

			let query = supabase.from('business').select(
				`
        *,
        business_images:business_images(*),
        reviews_summary:business_reviews_summary(*)
      `
			);

			if (image_limit) {
				query = query.limit(image_limit, { foreignTable: 'business_images' });
			}
			if (business_id) {
				query = query.eq('id', business_id);
			}

			const { data, error } = await query.limit(1).single();
			if (error) {
				console.error(error);
				return { error };
			}

			return { data };
		},
		getBusinessLocations: async (options?: { businessLimit: number; offset: number }) => {
			let query = supabase.from('business').select('id,location');

			if (options) {
				const { offset, businessLimit } = options;
				query = query.range(offset, offset + businessLimit - 1);
			}

			const { data, error } = await query;

			if (error) {
				console.error(error);
				return { error };
			}

			return { data };
		},
		createBusiness: async (data: TablesInsert<'business'>) => {
			const { data: newData, error } = await supabase
				.from('business')
				.insert(data)
				.select()
				.single();

			if (error) {
				return { error };
			}

			return { data: newData };
		},
		getBusinessProducts: async (business_id: number) => {
			const { data, error } = await supabase
				.from('products')
				.select('*, images:product_images(*)')
				.eq('business_id', business_id);

			if (error) {
				console.error(error);
				return { error };
			}

			return { data };
		}
	};
}
