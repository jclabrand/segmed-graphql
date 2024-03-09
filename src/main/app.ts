
import http, { Server } from 'http'

import express, { Express } from 'express'
import { config } from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { json } from 'body-parser'
import cors from 'cors'

import { Routes } from './routes'
import { GraphqlResolver } from './graphql'
import { Database } from './database'

export class App {
	express:	Express
	server:		Server
	graphql:	ApolloServer

	routes:	Routes
	api:	GraphqlResolver
	db:		Database

	constructor() {
		config()

		this.express = express()
		this.server = http.createServer(this.express)
		this.routes = new Routes()
		this.api = new GraphqlResolver()
		this.db = new Database()

		this.init()
	}

	async init() {
		this.express.use('/', this.routes.router)

		const httpServer = this.server
			, schema = this.api.schema
			, wsServer = new WebSocketServer({
				server: httpServer,
				path: '/graphql',
			})
			, serverCleanup = useServer({ schema }, wsServer)

		this.graphql = new ApolloServer({
			schema,
			plugins: [
				ApolloServerPluginDrainHttpServer({ httpServer }),
				{
					async serverWillStart() {
						return {
							async drainServer() {
								await serverCleanup.dispose()
							}
						}
					}
				}
			],
			introspection: true
		})

		await this.graphql.start()

		this.express.use(
			'/graphql',
			cors<cors.CorsRequest>(),
			json(),
			expressMiddleware(this.graphql, {
				context: this.api.buildContext(this.db.client, this.api.pubsub)
			})
		)

		this.server.listen(process.env.PORT, () => {
			console.log('Server ready on port', process.env.PORT)
		})
	}
}
