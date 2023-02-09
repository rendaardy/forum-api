import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

import {transform} from '@swc/core';

const extensionsRegex = /\.m?ts$/;

export async function load(url, context, nextLoad) {
	if (extensionsRegex.test(url)) {
		const rawSource = await readFile(fileURLToPath(url), {encoding: 'utf-8'});
		const output = await transform(rawSource, {
			filename: url,
			jsc: {
				target: 'es2022',
				parser: {
					syntax: 'typescript',
					dynamicImport: true,
					decorators: true,
				},
				transform: {
					legacyDecorator: true,
					decoratorMetadata: true,
					useDefineForClassFields: false,
				},
			},
			module: {
				type: 'es6',
			},
			sourceMaps: 'inline',
		});

		return {
			format: 'module',
			shortCircuit: true,
			source: output.code,
		};
	}

	return nextLoad(url, context);
}
