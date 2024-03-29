import {readFileSync} from 'node:fs';

import {pathsToModuleNameMapper} from 'ts-jest';

const {compilerOptions} = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));

/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	extensionsToTreatAsEsm: ['.ts'],
	modulePaths: [compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	roots: ['<rootDir>'],
	setupFiles: ['dotenv/config'],
	transform: {
		'^.+\\.[tj]sx?$': ['@swc/jest'],
	},
	watchman: false,
  maxWorkers: 1,
};
