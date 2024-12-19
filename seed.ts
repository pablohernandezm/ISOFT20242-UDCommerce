import { copycat } from '@snaplet/copycat';
import { createSeedClient, profilesScalars, SeedClient } from '@snaplet/seed';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
	'http://127.0.0.1:54321',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

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
	await createUsers(10);

	await seedAll(seed);

	// Seed the rest of the tables

	process.exit();
};

main();

async function hashPassword(password: string) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

async function createUsers(n: number = 1, defaultPassword = 'password') {
	for (let i = 0; i < n; i++) {
		const { data, error } = await supabase.auth.signUp({
			email: copycat.email(i),
			password: 'password123',
			options: {
				data: {
					first_name: copycat.firstName(i),
					last_name: copycat.lastName(i)
				}
			}
		});

		await supabase.auth.signOut();
	}
}

async function seedAll(seed: SeedClient) {
	const { data: profilesData } = await supabase.from('profiles').select('*');
	const profiles: profilesScalars[] = profilesData?.map((profile) => profile) ?? [];

	await seed.business(
		(x) =>
			x(4, ({ seed }) => ({
				name: copycat.streetName(seed),
				business_images: (x) =>
					x({ max: businessPictures.length }, ({ seed }) => ({
						image: copycat.oneOf(seed, businessPictures)
					})),
				reviews: (x) =>
					x({ max: profiles.length }, ({ seed, index }) => ({
						author_id: copycat.oneOf(seed, profiles).id,
						rate: copycat.float(seed, { min: 0, max: 5 })
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
			})),
		{ connect: { profiles } }
	);

	console.log('Database seeded successfully!');
}
