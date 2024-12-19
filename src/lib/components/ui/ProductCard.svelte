<script lang="ts">
	import type { Snippet } from 'svelte';
	import Carousel from './Carousel.svelte';
	import Image from './Image.svelte';

	let {
		src,
		price,
		description,
		product_id,
		header
	}: {
		src: string;
		price: number;
		name: string;
		description: string | null;
		product_id: string;
		header: Snippet<[string]>;
	} = $props();

	let dialog = $state<HTMLDialogElement>();
</script>

{#snippet trigger()}
	<div class="flex flex-col h-full rounded-lg overflow-clip gap-2 bg-violet-100 w-32 md:w-40">
		<div class="aspect-square overflow-clip w-full">
			<Image
				{src}
				alt="Imagen del producto"
				class="w-full h-full aspect-[1/1] object-cover flex justify-center items-center bg-violet-300 rounded-lg"
			/>
		</div>

		<div class="p-2">
			<h2 class="font-bold text-lg text-center">${price}</h2>
			<p class="text-sm text-zinc-800 line-clamp-4 text-left">{description}</p>
		</div>
	</div>
{/snippet}

<button
	class="w-full max-w-40"
	onclick={() => {
		dialog?.showModal();
	}}
>
	{@render trigger()}
</button>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

		<div class="header">
			{@render header(`modal_${product_id}`)}
		</div>

		<div class="description">
			{description}
		</div>

		<div class="carousel-container p-4">
			<Carousel
				images={[
					'https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
					'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
					'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
					'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
					'https://images.pexels.com/photos/3819969/pexels-photo-3819969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
				]}
			/>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.header {
		grid-area: 'header';
	}
	.description {
		grid-area: 'description';
	}

	.carousel-container {
		grid-area: 'carousel';
	}
	.modal-box {
		display: grid;
		grid-template-areas: 'header' 'description' 'carousel';
		gap: 8px;
	}
</style>
