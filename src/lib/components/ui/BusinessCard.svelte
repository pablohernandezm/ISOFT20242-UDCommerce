<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import BusinessHeader from './BusinessHeader.svelte';

	let {
		business_id,
		image_src,
		business_name,
		n_reviews,
		sum_reviews,
		products
	}: {
		business_id: number;
		image_src: string;
		business_name: string;
		n_reviews: number;
		sum_reviews: number;
		products: {
			id: number;
			image_src: string;
			price: number;
			description: string | null;
			name: string;
		}[];
	} = $props();

	let business_rate = $state(0);
</script>

<div class="flex flex-col bg-white p-4 rounded-lg">
	{#snippet header(key: string)}
		<BusinessHeader
			{business_id}
			{key}
			imageSrc={image_src}
			name={business_name}
			{n_reviews}
			{sum_reviews}
			user_rate={business_rate}
			onRateChange={(_, n) => {
				business_rate = n;
			}}
		/>
	{/snippet}

	{@render header('main')}

	<div class="flex gap-4 max-w-full overflow-x-auto py-2">
		{#each products as product}
			<ProductCard
				{header}
				src={product.image_src}
				price={0}
				description={product.description}
				name={product.name}
				product_id="P{product.id}"
			/>
		{/each}
	</div>
</div>
