/*
	Import modules here as needed.

	Exports here are exposed on the global namespace as 'App' by webpack.

	EG.
		App.CMSUtils

*/

import {} from './modules/ajax-button'

import {} from './modules/pagination-controller'

import {} from './modules/admin-controller'

import {} from './modules/uploadable-image'

import {} from './modules/mola-mola-helpers'

import {
	bootCMS,
	didLogIn,
	didLogOut,
	checkSubscription,
	flashAjaxStatus,
	loadPage,
	reloadPage,
	tropicBird
} from './modules/utils'

const CMSUtils = {
	bootCMS: bootCMS,
	didLogIn: didLogIn,
	didLogOut: didLogOut,
	checkSubscription: checkSubscription,
	flashAjaxStatus: flashAjaxStatus,
	loadPage: loadPage,
	reloadPage: reloadPage,
	tropicBird: tropicBird
}

export {
	CMSUtils
}
