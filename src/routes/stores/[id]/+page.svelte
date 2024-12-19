<script lang="ts">
	import BusinessHeader from '$lib/components/ui/BusinessHeader.svelte';
	import Carousel from '$lib/components/ui/Carousel.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { businessData, productData } = data;
</script>

{#if businessData}
	<div class="flex flex-col p-8 bg-white rounded-lg gap-4">
		<BusinessHeader
			key="main"
			business_id={businessData.id}
			name={businessData.name}
			imageSrc={businessData.business_images[0]?.image ?? '#'}
			sum_reviews={businessData.reviews_summary[0]?.total_rate ?? 0}
			n_reviews={businessData.reviews_summary[0]?.review_count ?? 0}
		/>

		<div>
			{businessData.description}
		</div>
		{#if businessData.business_images.length > 0}
			<Carousel images={businessData.business_images.map((i) => i.image ?? '#')} />
		{/if}
	</div>

	<div class="flex flex-col p-4 bg-white rounded-lg gap-4">
		<div class="flex gap-2 font-bold text-xl items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="orange"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-shopping-cart"
				><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path
					d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
				></path></svg
			>

			<h2>Catálogo</h2>
		</div>

		{#snippet header(key: string)}
			<BusinessHeader
				business_id={businessData.id}
				{key}
				imageSrc={businessData.business_images[0].image}
				name={businessData.name}
				n_reviews={businessData.reviews_summary[0].review_count ?? 0}
				sum_reviews={businessData.reviews_summary[0].review_count ?? 0}
			/>
		{/snippet}

		{#if productData}
			{#each productData as product}
				<ProductCard
					name={product.name}
					src={product.images[0].image}
					price={product.price}
					{header}
					product_id={product.id + ''}
					description={product.description}
				/>
			{/each}
		{/if}
	</div>
{/if}
