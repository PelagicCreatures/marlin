/*
	Import modules here as needed.

	Exports here are exposed on the global namespace as 'App' by webpack.

	EG.
		App.CMSUtils

*/

import './modules/ajax-button.js'

import './modules/pagination-controller.js'

import './modules/admin-controller.js'

import './modules/uploadable-image.js'

import './modules/mola-mola-helpers.js'

import * as CMSUtils from './modules/utils.js'

import {
	utils, Sargasso
}
	from '@pelagiccreatures/sargasso'

// expose these so huge markdown editor can be dynamically loaded
window.Sargasso = Sargasso
window.registerSargassoClass = utils.registerSargassoClass
window.elementTools = utils.elementTools

export {
	CMSUtils
}
