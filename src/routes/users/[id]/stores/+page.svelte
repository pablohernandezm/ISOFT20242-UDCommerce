<script lang="ts">
	import BusinessCard from '$lib/components/ui/BusinessCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { toast } from 'svelte-sonner';
	import { getInitials } from '$lib/profilesUtils';
	import { invalidateAll } from '$app/navigation';
	import BusinessFormDialog from '$lib/components/ui/BusinessFormDialog.svelte';

	let { data, form } = $props();
	const { businessData, profile } = data;
	let profileDialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (form?.error) {
			toast.error('No se pudo actualizar el perfil');
		} else if (form?.success) {
			invalidateAll();
		} else if (form?.message) {
			toast.error(form.message);
		}
	});
</script>

<div class="bg-white rounded-lg p-8 flex flex-col items-center gap-2">
	<div class="inline-flex flex-col gap-2 justify-center items-center">
		<Avatar.Root class="w-32 h-32 rounded-full bg-zinc-300">
			<Avatar.Image src={profile?.profile_picture?.image ?? '#'} alt="Alt"></Avatar.Image>
			<Avatar.Fallback
				>{getInitials(`${profile?.first_name} ${profile?.last_name}`)}</Avatar.Fallback
			>
		</Avatar.Root>

		<h2 class="card-title">{profile?.first_name} {profile?.last_name}</h2>
	</div>

	{#if data.user && data.user.id === data.profile?.id}
		<div class="flex gap-2">
			<button
				class="btn btn-outline p-1 px-2 text-xs"
				onclick={() => {
					profileDialog?.showModal();
				}}
				>Editar perfil
			</button>

			<BusinessFormDialog>
				<button aria-label="Crea un negocio" class="btn btn-outline p1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 256 256"
						fill="currentColor"
						stroke="currentColor"
						><path
							d="M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z"
						></path></svg
					>
				</button>
			</BusinessFormDialog>
		</div>

		<dialog bind:this={profileDialog} class="modal">
			<div class="modal-box relative w-full gap-2 flex flex-col h-auto py-10">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
				</form>

				<h2 class="card-title mb-2">Edición de perfil</h2>

				<form method="POST" action="?/profile" class="flex flex-col gap-2">
					<label>
						Nombre
						<input
							type="text"
							class="input input-bordered w-full"
							placeholder={data.profile.first_name}
							name="first_name"
						/>
					</label>

					<label>
						Apellido
						<input
							type="text"
							class="input input-bordered w-full"
							placeholder={data.profile.last_name}
							name="last_name"
						/>
					</label>

					<button type="submit" class="btn btn-primary grow">Guardar</button>
				</form>
			</div>

			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	{/if}
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
