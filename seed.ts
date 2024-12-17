import { copycat } from '@snaplet/copycat';
import { createSeedClient, SeedClient } from '@snaplet/seed';
import bcrypt from 'bcrypt';

const main = async () => {
	const seed = await createSeedClient();

	// Truncate all tables in the database
	await seed.$resetDatabase();

	// Seed the database with 10 users
	const { users } = await createUsers(seed, 3);

	// Seed the rest of the tables
	await seed.business((x) =>
		x(users.length, ({ seed }) => ({
			name: copycat.streetName(seed),
			owner_id: copycat.oneOf(seed, users).id,
			reviews: (x) =>
				x({ max: users.length }, ({ seed, index }) => ({
					author_id: users[index].id,
					rating: copycat.float(seed, { min: 0, max: 5 })
				})),
			products: (x) =>
				x({ max: 10 }, ({ seed }) => ({
					price: copycat.float(seed, { min: 0, max: 500000 }),
					name: copycat.words(seed, { max: 3 }),
					description: copycat.sentence(seed, { minWords: 10, max: 50 })
				}))
		}))
	);

	console.log('Database seeded successfully!');

	process.exit();
};

main();

async function hashPassword(password: string) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

async function createUsers(seed: SeedClient, n: number = 1, defaultPassword = 'password') {
	const PASSWORD = await hashPassword(
		defaultPassword.length >= 8 ? defaultPassword : 'password123'
	);

	return await seed.users((x) =>
		x(n, ({ index, seed }) => ({
			id: copycat.uuid(seed),
			instance_id: '00000000-0000-0000-0000-000000000000',
			aud: 'authenticated',
			role: 'authenticated',
			email: `user${index}@email.com`,
			encrypted_password: PASSWORD,
			// email_confirmed_at: "", // Snaplet will generate this for you
			invited_at: null,
			confirmation_token: null,
			confirmation_sent_at: null,
			recovery_token: null,
			recovery_sent_at: null,
			email_change_token_new: null,
			email_change: '',
			email_change_sent_at: null,
			// last_sign_in_at: "", // Snaplet will generate this for you
			raw_app_meta_data: { provider: 'email', providers: ['email'] },
			raw_user_meta_data: {
				first_name: copycat.firstName(seed),
				last_name: copycat.lastName(seed)
			},
			is_super_admin: null,
			// created_at: "", // Snaplet will generate this for you
			// updated_at: "", // Snaplet will generate this for you
			phone: null,
			phone_confirmed_at: null,
			phone_change: '',
			phone_change_token: '',
			phone_change_sent_at: null,
			email_change_token_current: null,
			email_change_confirm_status: 0,
			banned_until: null,
			reauthentication_token: null,
			reauthentication_sent_at: null,
			is_sso_user: false,
			deleted_at: null,
			is_anonymous: false
		}))
	);
}
