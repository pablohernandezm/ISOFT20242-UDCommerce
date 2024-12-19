<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import AccessDialog from '$lib/components/ui/AccessDialog.svelte';
	import HeaderIcon from '$lib/components/ui/HeaderIcon.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import Map from '$lib/components/ui/Map.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster />
<div class="flex flex-col gap-2">
	<header class="w-full bg-white rounded-lg p-4">
		<nav>
			<ul class="flex justify-between">
				<div>
					<Map>
						<HeaderIcon src={'/icons/map.svg'} alt={'abrir mapa'} />
					</Map>
				</div>
				<div class="flex gap-1">
					<a href="/">
						<HeaderIcon src={'/icons/home.svg'} alt={'Inicio'} />
					</a>

					{#if data.session}
						<a href={`/users/${data.session.user.id}/stores`}>
							<HeaderIcon src={'/icons/storefront.svg'} alt={'Ver tu perfil'} />
						</a>
					{/if}

					<div class="flex justify-center items-center">
						{#if data.session}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Avatar.Root class="w-10 aspect-square rounded-full">
										<Avatar.Image src="" alt="Alt"></Avatar.Image>
										<Avatar.Fallback>FA</Avatar.Fallback>
									</Avatar.Root>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="bg-white">
									<DropdownMenu.Group>
										<DropdownMenu.Item
											href={`/auth/logout?redirectTo=${encodeURIComponent(location.pathname)}`}
											class="cursor-pointer">Cerrar sesión</DropdownMenu.Item
										>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<AccessDialog loginFormData={data.loginForm} registerFormData={data.registerForm}>
								<HeaderIcon src="/icons/log-in.svg" alt="Acceder" />
							</AccessDialog>
						{/if}
					</div>
				</div>
			</ul>
		</nav>
	</header>

	<SearchBar />

	{@render children()}
</div>

<style>
	:global(body) {
		padding: 5px;
		background-color: #b1b2b5;
	}
</style>
