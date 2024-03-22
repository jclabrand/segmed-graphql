
import { Group } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class GroupResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Group)
	}

	async index(_, args, { db }: IContext): Promise<Array<Group>> {
		const groups = await db.group.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		return groups
	}

}
