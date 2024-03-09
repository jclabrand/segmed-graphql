
import { Request, Response } from 'express'

export class HomeController {
	index(_: Request, res: Response) {
		res.json({ message: 'SEGMED API Services' })
	}
}
