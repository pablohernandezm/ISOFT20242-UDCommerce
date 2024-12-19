<script lang="ts">
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import mapbox from 'mapbox-gl/dist/mapbox-gl.js';
	import { onMount, type Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { children }: { children: Snippet } = $props();

	mapbox.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	let dialog = $state<HTMLDialogElement>();

	const lngBounds = [-75.50486356249777, -75.50678678693976];
	const latBounds = [10.401756705965795, 10.403628802378421];

	type LocationResult = {
		sucess: boolean;
		data: {
			id: number;
			location: string;
		}[];
	};

	let locations: LocationResult;

	onMount(async () => {
		const map = new mapbox.Map({
			container: 'map',
			style: 'mapbox://styles/phernandezm/cm3f937r2001q01ryhiumfbgy',
			bounds: [
				[lngBounds[0], latBounds[0]],
				[lngBounds[1], latBounds[1]]
			],
			zoom: 17.75
		});

		try {
			const response = await fetch('/api/map');

			if (!response.ok) {
				throw new Error();
			}

			const result = await response.json();

			locations = result;

			locations.data.forEach((v, i) => {
				const splitted = v.location.replace(/[()]/g, '').split(',');
				const lng = parseFloat(splitted[1]) ?? 0;
				const lat = parseFloat(splitted[0]) ?? 0;

				new mapbox.Marker().setLngLat([lng, lat]).addTo(map);
			});
		} catch (error) {
			console.error(error);
			toast.error('Error inesperado al obtener la ubicación de los negocios.');
		}
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<button
	onclick={() => {
		dialog?.showModal();
	}}
>
	{@render children()}
</button>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box relative w-full h-full">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
		</form>

		<div id={'map'} class="w-full h-full"></div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	:global(.marker) {
		background-size: cover;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
