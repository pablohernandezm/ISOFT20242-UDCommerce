<script lang="ts">
	import BusinessCard from '$lib/components/ui/BusinessCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getInitials } from '$lib/profilesUtils';

	let { data } = $props();
	const { businessData, profile } = data;
</script>

<div class="bg-white rounded-lg p-8 flex flex-col items-center gap-2">
	<Avatar.Root class="w-32 h-32 rounded-full bg-zinc-300">
		<Avatar.Image src={profile?.profile_picture?.image ?? '#'} alt="Alt"></Avatar.Image>
		<Avatar.Fallback>{getInitials(`${profile?.first_name} ${profile?.last_name}`)}</Avatar.Fallback>
	</Avatar.Root>

	<h2 class="card-title">{profile?.first_name} {profile?.last_name}</h2>
</div>

<div class="flex flex-col gap-4">
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
</div>
