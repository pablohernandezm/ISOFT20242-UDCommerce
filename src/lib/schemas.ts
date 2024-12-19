import { z } from 'zod';

// Regex for prohibited characters in the local part of the email
const prohibitedChars = /[()<>[\]:;@\\,/" ]/;

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Este campo debe ser llenado.' })
		.email('Correo electrónico no válido.')
		.refine((email) => {
			const [localPart] = email.split('@');

			// Check if local part has any prohibited characters or consecutive dots
			return (
				!prohibitedChars.test(localPart) &&
				!localPart.startsWith('.') &&
				!localPart.endsWith('.') &&
				!localPart.includes('..')
			);
		}),
	password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
});
export type LoginSchema = typeof loginSchema;

export const registerSchema = z
	.object({
		first_name: z.string(),
		last_name: z.string(),
		email: z
			.string()
			.min(1, { message: 'Este campo debe ser llenado.' })
			.email('Correo electrónico no válido.')
			.refine((email) => {
				const [localPart] = email.split('@');

				// Check if local part has any prohibited characters or consecutive dots
				return (
					!prohibitedChars.test(localPart) &&
					!localPart.startsWith('.') &&
					!localPart.endsWith('.') &&
					!localPart.includes('..')
				);
			}),
		password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
		confirm_password: z
			.string()
			.min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
		profile_picture: z.instanceof(File)
	})
	.superRefine(({ password, confirm_password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Las contraseñas no coinciden.',
				path: ['confirm_password']
			});
		}
	});
export type RegisterSchema = typeof registerSchema;
