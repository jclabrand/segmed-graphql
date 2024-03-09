
import { User } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class UserResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.User)
	}

	async index(_, args, { db }: IContext): Promise<User[]> {
		const records = await db.user.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		return records
	}

	async current(_, args: { sessionId: number }, context: IContext): Promise<User> {
		if (context.session.id !== args.sessionId) throw 'El portador no es válido.'
		return context.user
	}
	
}
