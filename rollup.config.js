import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

import {
	terser
}
	from 'rollup-plugin-terser'

export default {
	input: './assets/app.mjs',

	output: [{
		format: 'iife',
		file: 'dist/js/marlin.iife.js',
		name: 'App'
	}, {
		format: 'iife',
		file: 'dist/js/marlin.iife.min.js',
		sourcemap: true,
		name: 'App',
		plugins: [
			terser({
				output: {
					comments: false
				}
			})
		]
	}],

	plugins: [
		json(),
		commonjs({}),
		nodeResolve({
			preferBuiltins: false,
			dedupe: (dep) => {
				return dep.match(/^(@pelagiccreatures|lodash|js-cookie)/)
			}
		})
	]
}
