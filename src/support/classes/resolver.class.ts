
import { IEvent } from '../types'


export class Resolver {

	constructor(public event: IEvent) {}

	public created({ pubsub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.CREATED)
		}
	}

	public updated({ pubsub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPDATED)
		}
	}

	public deleted({ pubsub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.DELETED)
		}
	}

	public upserted({ pubsub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPSERTED)
		}
	}
}
