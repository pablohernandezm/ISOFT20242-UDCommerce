import { copycat } from '@snaplet/copycat';
import { createSeedClient, SeedClient } from '@snaplet/seed';
import bcrypt from 'bcrypt';

/*
const profilePictures = [
  'https://images.pexels.com/photos/678783/pexels-photo-678783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
]*/

const businessPictures = [
	'https://images.pexels.com/photos/25713077/pexels-photo-25713077/free-photo-of-compras-comprando-mercado-estar-de-pie.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/25255085/pexels-photo-25255085/free-photo-of-zapatos-lineas-compras-comprando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/14083994/pexels-photo-14083994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/27376928/pexels-photo-27376928/free-photo-of-ciudad-trafico-hombre-acera.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/29776877/pexels-photo-29776877/free-photo-of-puesto-de-dulces-en-el-mercadillo-navideno-de-kassel.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];

const productPictures = [
	'https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	'https://images.pexels.com/photos/3819969/pexels-photo-3819969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];

const main = async () => {
	const seed = await createSeedClient();

	// Truncate all tables in the database
	await seed.$resetDatabase();

	// Seed the database with 10 users
	const { users } = await createUsers(seed, 10);

	// Seed the rest of the tables
	await seed.business((x) =>
		x(4, ({ seed }) => ({
			name: copycat.streetName(seed),
			owner_id: copycat.oneOf(seed, users).id,
			business_images: (x) =>
				x({ max: businessPictures.length }, ({ seed }) => ({
					image: copycat.oneOf(seed, businessPictures)
				})),
			reviews: (x) =>
				x({ max: users.length }, ({ seed, index }) => ({
					author_id: users[index].id,
					rating: copycat.float(seed, { min: 0, max: 5 })
				})),
			products: (x) =>
				x({ max: 10 }, ({ seed }) => ({
					price: copycat.float(seed, { min: 0, max: 500000 }),
					name: copycat.words(seed, { max: 3 }),
					description: copycat.sentence(seed, { minWords: 10, max: 50 }),
					product_images: (x) =>
						x({ max: productPictures.length }, ({ seed }) => ({
							image: copycat.oneOf(seed, productPictures)
						}))
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
