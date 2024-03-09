
import { IContext, IAuthPayload } from '../../../support/types'
import { Status } from '../../../support/constants/status.constant'
import { Auth } from '../../../support/classes'


export class SessionResolver {

	authorized(resolve) {
		return async function(source, args, context: IContext, info) {
			const { headers } = context.req

			if (headers && headers.authorization) {
				const authData = headers.authorization.split(' ')
					, session = await context.db.session.findUnique({ where: { id: Number(authData[0]) } })

				if (!session) throw 'El portador no es válido.'
				if (session.status !== Status.Active) throw 'Sesión de usuario no es válido.'

				const payload = await Auth.verify<IAuthPayload>(authData[1], session.publicKey)
					, user = await context.db.user.findUnique({ where: { userName: payload.userName } })

				context.user = user
				context.session = session

				return resolve(source, args, context, info)
			}
			else throw 'El usuario no tiene credenciales.'
		}
	}

	async signIn(_, args: { data: { userName: string, password: string } }, { db }: IContext):
		Promise<{ sessionId: number, authorization: string }> {
		try {
			const { userName, password } = args.data

			const user = await db.user.findUnique({
				where: { userName, status: Status.Active }
			})
			if (!user) throw 'Usuario no encontrado.'

			const psws = await db.userPassword.findMany({ where: { userName, status: Status.Active }})
			if (psws.length !== 1) throw 'Contraseña no encontrada en base de datos. '

			const match = await Auth.compare(password, psws[0].encrypted)
			if (!match) throw 'Contraseña incorrecta.'

			const { publicKey, privateKey } = Auth.rsa()
				, payload: IAuthPayload = {
					userName,
					displayName: user.displayName
				}
				, token = await Auth.sign<IAuthPayload>(payload, privateKey)
				, session = await db.session.create({ data: { userName, publicKey, privateKey }})

			return {
				sessionId: session.id,
				authorization: token
			}
		} catch (error) {
			throw 'Nombre de usuario o contraseña incorrecto.'
		}
	}

	async signOut(_, args: { sessionId: number }, context: IContext): Promise<number> {
		const { id } = context.session

		if (id !== args.sessionId) throw 'El portador no es válido.'

		const session = await context.db.session.update({ where: { id }, data: { status: Status.Idle } })
		return session.id
	}

}
