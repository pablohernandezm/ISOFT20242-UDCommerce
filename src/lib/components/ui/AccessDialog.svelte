<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginSchema, registerSchema, type LoginSchema, type RegisterSchema } from '$lib/schemas';
	import { untrack, type Snippet } from 'svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let {
		loginFormData: loginData,
		registerFormData: registerData,
		children
	}: {
		loginFormData: SuperValidated<Infer<LoginSchema>>;
		registerFormData: SuperValidated<Infer<RegisterSchema>>;
		children: Snippet;
	} = $props();

	const loginForm = superForm(loginData, {
		validators: zodClient(loginSchema)
	});

	const registerForm = superForm(registerData, {
		validators: zodClient(registerSchema)
	});

	const { form: loginFormData, enhance: loginEnhance } = loginForm;
	const { form: registerFormData, enhance: registerEnhance } = registerForm;

	let dialog = $state<HTMLDialogElement>();

	let type = $state<'login' | 'register'>('login');
	function toggle() {
		type = type === 'login' ? 'register' : 'login';
	}

	let error = $state<string | null>(null);
	let success = $state<string | null>(null);

	$effect(() => {
		if (error) {
			toast.error(error);

			untrack(() => {
				error = null;
			});
		}

		if (success) {
			invalidateAll();
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!e.target) return;

		e.preventDefault(); // Evita que el formulario recargue la página
		error = null;
		success = null;

		const formData = new FormData(e.target as HTMLFormElement); // Toma los datos del formulario
		formData.append('action', type); // Añade el tipo de acción al formData

		const res = await fetch('/auth', {
			method: 'POST',
			body: formData
		});

		const result = await res.json();
		if (result.success) {
			success = 'Operation successful!';
		} else {
			error = result.error;
		}
	};
</script>

<button
	onclick={() => {
		dialog?.showModal();
	}}
>
	{@render children?.()}
</button>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

		{#if type === 'login'}
			<form method="POST" onsubmit={handleSubmit} use:loginEnhance>
				<Form.Field form={loginForm} name="email">
					<Form.Control let:attrs>
						<Form.Label>Correo electrónico</Form.Label>
						<Input {...attrs} bind:value={$loginFormData.email} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={loginForm} name="password">
					<Form.Control let:attrs>
						<Form.Label>Contraseña</Form.Label>
						<Input {...attrs} bind:value={$loginFormData.password} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button>Iniciar sesión</Form.Button>

				<p>¿Aún no tienes una cuenta? <button class="link" onclick={toggle}>regístrate</button></p>
			</form>
		{:else}
			<form method="POST" onsubmit={handleSubmit} use:registerEnhance>
				<Form.Field form={registerForm} name="first_name">
					<Form.Control let:attrs>
						<Form.Label>Primer nombre</Form.Label>
						<Input {...attrs} bind:value={$registerFormData.first_name} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={registerForm} name="last_name">
					<Form.Control let:attrs>
						<Form.Label>Apellido</Form.Label>
						<Input {...attrs} bind:value={$registerFormData.last_name} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={registerForm} name="email">
					<Form.Control let:attrs>
						<Form.Label>Correo electrónico</Form.Label>
						<Input {...attrs} bind:value={$registerFormData.email} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={registerForm} name="password">
					<Form.Control let:attrs>
						<Form.Label>Contraseña</Form.Label>
						<Input {...attrs} bind:value={$registerFormData.password} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={registerForm} name="confirm_password">
					<Form.Control let:attrs>
						<Form.Label>Confirmación de contraseña</Form.Label>
						<Input {...attrs} bind:value={$registerFormData.confirm_password} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="btn btn-primary">Registrarse</Form.Button>

				<p>¿Ya tienes una cuenta? <button class="link" onclick={toggle}>Inicia sesión</button></p>
			</form>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
