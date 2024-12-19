<script lang="ts">
	import type { Snippet } from 'svelte';

	let dialog = $state<HTMLDialogElement>();
	let { children }: { children: Snippet } = $props();
</script>

<button
	aria-label="Crea tu negocio"
	class="contents"
	onclick={() => {
		dialog?.showModal();
	}}
>
	{@render children()}
</button>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box relative w-full gap-2 flex flex-col h-auto py-10">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
		</form>

		<h2 class="card-title mb-2">Edición de perfil</h2>

		<form method="POST" action="/stores?/create" class="flex flex-col gap-2">
			<label>
				Nombre
				<input type="text" class="input input-bordered w-full" name="name" required />
			</label>

			<label>
				Descripción
				<input type="text" class="input input-bordered w-full" name="description" />
			</label>

			<button type="submit" class="btn btn-primary grow">Guardar</button>
		</form>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
