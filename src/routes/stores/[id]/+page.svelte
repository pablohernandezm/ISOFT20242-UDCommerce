<script lang="ts">
	import BusinessHeader from '$lib/components/ui/BusinessHeader.svelte';
	import Carousel from '$lib/components/ui/Carousel.svelte';

	let { data } = $props();
	const { businessData: businessArr } = data;
	const { id, name, business_images, reviews_summary, description } = businessArr[0];
</script>

<div class="flex flex-col p-8 bg-white rounded-lg gap-4">
	<BusinessHeader
		key="main"
		business_id={id}
		{name}
		imageSrc={business_images[0]?.image ?? '#'}
		sum_reviews={reviews_summary[0]?.total_rate ?? 0}
		n_reviews={reviews_summary[0]?.review_count ?? 0}
	/>

	<div>
		{description}
	</div>
	<Carousel images={business_images.map((i) => i.image ?? '#')} />
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
	<div class="p-4 flex flex-wrap gap-8 overflow-clip">
		{#each { length: 3 } as _, i}
			<div class="w-full max-w-80"></div>
		{/each}
	</div>
</div>
