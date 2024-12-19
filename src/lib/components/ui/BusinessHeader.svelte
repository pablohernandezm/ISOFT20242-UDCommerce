<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import Image from './Image.svelte';
	let {
		imageSrc,
		name,
		business_id,
		n_reviews = 0,
		sum_reviews = 0,
		key,
		onRateChange,
		user_rate
	}: {
		business_id: number;
		imageSrc: string;
		name: string;
		n_reviews: number;
		sum_reviews: number;
		key?: string;
		onRateChange?: (Old: number, New: number) => unknown;
		user_rate?: number;
	} = $props();

	let rating = $derived(n_reviews > 0 ? sum_reviews / n_reviews : 0);
	let selectedRating = $state<number>();
	let oldRate = user_rate ?? 0;
	let href = $derived(`/stores/${business_id}`);

	$inspect(selectedRating, rating);

	$effect(() => {
		if (user_rate) {
			untrack(() => {
				selectedRating = user_rate;
			});
		}
	});

	$effect(() => {
		if (selectedRating) {
			oldRate = user_rate ?? 0;
			untrack(() => {
				user_rate = selectedRating;
			});

			if (onRateChange) {
				onRateChange(oldRate, selectedRating);
			}
		}
	});

	onMount(() => {
		if (onRateChange) {
			onRateChange(0, user_rate ?? 0);
		}
	});
</script>

<div class="flex gap-2">
	<a {href}>
		<Image
			src={imageSrc}
			alt="Portada de {name}"
			class="aspect-square w-12 overflow-hidden rounded-lg"
		/>
	</a>
	<div>
		<div class="flex gap-2">
			<a {href}>
				<h2 class="font-bold text-xl">{name}{key}</h2>
			</a>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="w-4 aspect-square text-amber-500"
				><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle
					cx="12"
					cy="10"
					r="3"
				></circle></svg
			>
		</div>

		<div class="inline-flex items-center">
			{#each { length: 5 } as _, i}
				{@const rate = i + 1}
				{@const id = `${key ?? ''}_${business_id}_rating${i}`}
				<input
					type="radio"
					name="rating"
					{id}
					value={rate}
					bind:group={selectedRating}
					checked={i <= rating}
					data-checked={selectedRating ? selectedRating >= rate : i + 1 <= rating}
				/>
				<label for={id}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-star"
						><polygon
							points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						></polygon></svg
					>
				</label>
			{/each}
			<span class="text-sm text-zinc-500 mx-2">{rating.toFixed(2)}</span>
		</div>
	</div>
</div>

<style>
	input {
		@apply opacity-0 absolute;
	}
	label > svg {
		fill: currentColor;
		stroke: currentColor;
	}
	label {
		@apply text-zinc-200 cursor-pointer;
	}

	input:disabled + label {
		@apply cursor-auto;
	}

	input:focus + label {
		scale: 1.2;
	}

	input[data-checked='true'] + label {
		@apply text-yellow-400;
	}
</style>
