
import express, { Router } from 'express'

import { home } from '../controllers'


export class Routes {
	router: Router

	constructor() {
		this.router = express.Router()

		this.router.get('/', this.getHome())
	}

	getHome() { return home.index }

}
