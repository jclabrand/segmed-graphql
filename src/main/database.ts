
import { PrismaClient } from '@prisma/client'


export class Database {
	client: PrismaClient

	constructor() {
		this.client = new PrismaClient()
	}
}
