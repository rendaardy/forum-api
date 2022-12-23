import {readFileSync} from 'node:fs';

import {pathsToModuleNameMapper} from 'ts-jest';

const {compilerOptions} = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));

/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	extensionsToTreatAsEsm: ['.ts'],
	maxWorkers: 1,
	modulePaths: [compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	roots: ['<rootDir>'],
	setupFiles: ['dotenv/config'],
	// Transform: {
	//    "^.+\\.[tj]sx?$": ["ts-jest", { useESM: true, isolatedModules: false }],
	//  },
	preset: 'ts-jest/presets/default-esm',
	watchman: false,
};
