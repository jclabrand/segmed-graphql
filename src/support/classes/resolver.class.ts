
import { PubSub } from 'graphql-subscriptions'

import { IEvent } from '../types'


export class Resolver {

	constructor(public event: IEvent) {}

	public created({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.CREATED)
		}
	}

	public updated({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPDATED)
		}
	}

	public deleted({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.DELETED)
		}
	}

	public upserted({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPSERTED)
		}
	}

	public publish({ pubsub, events, dataset }: { pubsub: PubSub, events: Array<string>, dataset: Array<object> }) {
		for (let index = 0; index < events.length; index++) {
			pubsub.publish(events[index], dataset[index])
		}
	}
}
