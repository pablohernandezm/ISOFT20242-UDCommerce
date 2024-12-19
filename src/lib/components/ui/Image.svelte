<script lang="ts">
	import { onMount } from 'svelte';
	let { src, alt, class: className }: { src: string; alt: string; class?: string } = $props();

	let loaded = $state(false);
	let failed = $state(false);
	let loading = $state(false);

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};

		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});

	let defaultClass =
		'rounded-lg w-12 h-12 flex justify-center items-center bg-zinc-200 text-zinc-500';
</script>

<div
	class={`${failed ? 'flex justify-center items-center' : ''} ${!className ? defaultClass : className}`}
>
	{#if failed}
		<svg
			class="h-1/2 w-1/2 rounded-lg"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle
				cx="8.5"
				cy="8.5"
				r="1.5"
			></circle><polyline points="21 15 16 10 5 21"></polyline></svg
		>
	{:else if loaded}
		<img {src} {alt} class="object-cover h-full w-full" />
	{/if}
</div>
