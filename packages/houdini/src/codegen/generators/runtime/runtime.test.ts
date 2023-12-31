import type { ProgramKind } from 'ast-types/lib/gen/kinds'
import * as recast from 'recast'
import * as typeScriptParser from 'recast/parsers/typescript'
import { test, expect } from 'vitest'

import { runPipeline } from '../..'
import { fs, path } from '../../../lib'
import type { Document } from '../../../lib/types'
import { testConfig, mockCollectedDoc } from '../../../test'

test('updates the config file with import path', async function () {
	const config = testConfig({ module: 'esm' })
	// execute the generator
	await runPipeline(config, [])

	// open up the index file
	const fileContents = await fs.readFile(
		path.join(config.runtimeDirectory, 'imports', 'config.js')
	)

	// verify contents
	expect(fileContents).toContain("from '../../../config.cjs'")
})

test('runtime index file - cjs', async function () {
	// the documents to test
	const docs: Document[] = [
		mockCollectedDoc(`query TestQuery { version }`),
		mockCollectedDoc(`fragment TestFragment on User { firstName }`),
	]

	const config = testConfig({ module: 'commonjs' })
	// execute the generator
	await runPipeline(config, docs)

	// open up the index file
	const queryContents = await fs.readFile(path.join(config.rootDir, 'index.js'))
	expect(queryContents).toBeTruthy()
	// parse the contents
	const parsedQuery: ProgramKind = recast.parse(queryContents!, {
		parser: typeScriptParser,
	}).program
	// verify contents
	expect(parsedQuery).toMatchInlineSnapshot(`
		"use strict";
		var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (this && this.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		var __importDefault = (this && this.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(require("./runtime/client"), exports);

		__exportStar(require("./runtime"), exports);

		__exportStar(require("./artifacts"), exports);

		__exportStar(require("./graphql"), exports);
	`)
})

test('runtime index file - kit', async function () {
	// the documents to test
	const docs: Document[] = [
		mockCollectedDoc(`query TestQuery { version }`),
		mockCollectedDoc(`fragment TestFragment on User { firstName }`),
	]

	const config = testConfig({ module: 'esm' })
	// execute the generator
	await runPipeline(config, docs)

	// open up the index file
	const contents = await fs.readFile(path.join(config.rootDir, 'index.js'))
	expect(contents).toBeTruthy()
	// parse the contents
	const parsed: ProgramKind = recast.parse(contents!, {
		parser: typeScriptParser,
	}).program
	// verify contents
	expect(parsed).toMatchInlineSnapshot(`
		export * from "./runtime/client"

		export * from "./runtime"

		export * from "./artifacts"

		export * from "./graphql"
	`)
})
