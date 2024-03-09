
import { PrismaClient } from '@prisma/client'
import { Auth } from '../classes'


const data = {
	usuarios: [
		{
			user: {
				userName: 'admin',
				displayName: 'Administrador',
				email: 'admin@company.com'
			},
			password: 'company'
		},
		{
			user: {
				userName: 'medicomedina',
				displayName: 'Medico Medina',
				email: 'medina@company.com'
			},
			password: 'medico1'
		}
	],
}


async function createAutorizacion(client: PrismaClient) {
	console.log('...Creando autorizacion')
	try {
		for (const seed of data.usuarios) {
			await client.user.create({
				data: {
					...seed.user,
					passwords: {
						create: [{ encrypted: await Auth.hash(seed.password) }]
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}
}

async function build() {
	const client: PrismaClient = new PrismaClient()

	await createAutorizacion(client)
}

build()
