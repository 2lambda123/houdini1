import { Config, writeFile } from '../../../common'
import enums from './enums'

// schemaGenerator updates the schema file to contain all of the generated
export default async function schemaGenerator(config: Config) {
	await Promise.all([
		writeFile(config.definitionsSchemaPath, config.newSchema),
		writeFile(config.definitionsDocumentsPath, config.newDocuments),
		enums(config),
	])
}
