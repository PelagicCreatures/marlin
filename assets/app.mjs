/*
	Import modules here as needed.

	Exports here are exposed on the global namespace as 'App' by webpack.

	EG.
		App.CMSUtils

*/

import './modules/ajax-button'

import './modules/pagination-controller'

import './modules/admin-controller'

import './modules/uploadable-image'

import './modules/mola-mola-helpers'

import * as CMSUtils from './modules/utils'

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
