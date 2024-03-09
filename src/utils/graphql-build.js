
const fs = require('fs')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { printSchemaWithDirectives } = require('@graphql-tools/utils')

const typesArray = loadFilesSync('./src', { recursive: true, extensions: ['graphql'] })
const schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs(typesArray)
})

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/schema.graphql', printSchemaWithDirectives(schema))
