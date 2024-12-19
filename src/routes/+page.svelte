<script lang="ts">
	import BusinessCard from '$lib/components/ui/BusinessCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const businessData = data.businessData;
</script>

{#each businessData as business}
	<BusinessCard
		image_src={business.business_images[0]?.image ?? '#'}
		products={business.products.map((i) => {
			return {
				id: i.id,
				image_src: i.product_images[0]?.image ?? '#',
				description: i.description,
				price: i.price,
				name: i.name
			};
		})}
		sum_reviews={business.reviews_summary[0]?.total_rate ?? 0}
		n_reviews={business.reviews_summary[0]?.review_count ?? 0}
		business_name={business.name}
		business_id={business.id}
	/>
{/each}
