<script lang="ts">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';

	import '@splidejs/svelte-splide/css';
	let {
		images,
		label
	}: {
		label?: string;
		images: string[];
	} = $props();

	let activeImg = $state(0);
</script>

<div class="splide_container contents">
	<Splide
		aria-label={label}
		options={{
			lazyLoad: 'nearby',
			cover: true,
			fixedHeight: 300,
			gap: 8
		}}
		on:move={(e) => {
			if (e) {
				activeImg = e.detail.index;
			}
		}}
	>
		{#each images as src, i}
			<SplideSlide>
				<img data-splide-lazy={src} alt="Imagen #{i}" />
			</SplideSlide>
		{/each}
	</Splide>
</div>

<style>
</style>
