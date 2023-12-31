import type * as graphql from 'graphql'
import path from 'node:path'

import type { Config } from '../config'

export function isSecondaryBuild() {
	return process.env.HOUDINI_SCHEMA_BUILD === 'true'
}

export async function buildLocalSchema(config: Config): Promise<void> {
	// load the current version of vite
	const { build } = await import('vite')

	process.env.HOUDINI_SCHEMA_BUILD = 'true'

	// build the schema somewhere we can import from
	await build({
		logLevel: 'silent',
		build: {
			outDir: path.join(config.rootDir, 'temp'),
			rollupOptions: {
				input: {
					schema: path.join(config.localApiDir, '+schema'),
				},
				external: ['graphql'],
				output: {
					entryFileNames: 'assets/[name].js',
				},
			},
			lib: {
				entry: {
					schema: path.join(config.localApiDir, '+schema'),
				},
				formats: ['es'],
			},
		},
	})

	process.env.HOUDINI_SCHEMA_BUILD = 'false'
}

export async function loadLocalSchema(config: Config): Promise<graphql.GraphQLSchema> {
	await buildLocalSchema(config)

	// import the schema we just built
	const { default: schema } = await import(
		path.join(config.rootDir, 'temp', 'assets', 'schema.js')
	)

	return schema
}
