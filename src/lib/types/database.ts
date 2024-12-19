export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			business: {
				Row: {
					description: string | null;
					id: number;
					location: unknown | null;
					name: string;
					owner_id: string;
					phone: string | null;
				};
				Insert: {
					description?: string | null;
					id?: number;
					location?: unknown | null;
					name: string;
					owner_id: string;
					phone?: string | null;
				};
				Update: {
					description?: string | null;
					id?: number;
					location?: unknown | null;
					name?: string;
					owner_id?: string;
					phone?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'business_owner_id_fkey';
						columns: ['owner_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			business_images: {
				Row: {
					business_id: number;
					id: number;
					image: string;
				};
				Insert: {
					business_id: number;
					id?: number;
					image: string;
				};
				Update: {
					business_id?: number;
					id?: number;
					image?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'business_images_business_id_fkey';
						columns: ['business_id'];
						isOneToOne: false;
						referencedRelation: 'business';
						referencedColumns: ['id'];
					}
				];
			};
			product_images: {
				Row: {
					id: number;
					image: string;
					product_id: number;
				};
				Insert: {
					id?: number;
					image: string;
					product_id: number;
				};
				Update: {
					id?: number;
					image?: string;
					product_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'product_images_product_id_fkey';
						columns: ['product_id'];
						isOneToOne: false;
						referencedRelation: 'products';
						referencedColumns: ['id'];
					}
				];
			};
			products: {
				Row: {
					business_id: number;
					description: string | null;
					id: number;
					name: string;
					price: number;
				};
				Insert: {
					business_id: number;
					description?: string | null;
					id?: number;
					name: string;
					price: number;
				};
				Update: {
					business_id?: number;
					description?: string | null;
					id?: number;
					name?: string;
					price?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'products_business_id_fkey';
						columns: ['business_id'];
						isOneToOne: false;
						referencedRelation: 'business';
						referencedColumns: ['id'];
					}
				];
			};
			profile_pictures: {
				Row: {
					image: string;
					profile_id: string;
				};
				Insert: {
					image: string;
					profile_id: string;
				};
				Update: {
					image?: string;
					profile_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'profile_pictures_profile_id_fkey';
						columns: ['profile_id'];
						isOneToOne: true;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			profiles: {
				Row: {
					first_name: string | null;
					id: string;
					last_name: string | null;
				};
				Insert: {
					first_name?: string | null;
					id: string;
					last_name?: string | null;
				};
				Update: {
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
				};
				Relationships: [];
			};
			reviews: {
				Row: {
					author_id: string;
					business_id: number;
					comment: string | null;
					id: number;
					rate: number;
				};
				Insert: {
					author_id: string;
					business_id: number;
					comment?: string | null;
					id?: number;
					rate: number;
				};
				Update: {
					author_id?: string;
					business_id?: number;
					comment?: string | null;
					id?: number;
					rate?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'reviews_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reviews_business_id_fkey';
						columns: ['business_id'];
						isOneToOne: false;
						referencedRelation: 'business';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			business_reviews_summary: {
				Row: {
					business_id: number | null;
					review_count: number | null;
					total_rate: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'reviews_business_id_fkey';
						columns: ['business_id'];
						isOneToOne: false;
						referencedRelation: 'business';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Functions: {
			is_business_member: {
				Args: {
					business_id: number;
					userid?: string;
				};
				Returns: boolean;
			};
			is_business_member_from_product: {
				Args: {
					product_id: number;
					userid?: string;
				};
				Returns: boolean;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;
