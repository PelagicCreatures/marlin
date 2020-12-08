import {
	Sargasso, utils
}
	from '@pelagiccreatures/sargasso'

import * as CMSUtils from './utils'

class digitopiaAnalyticsReport extends Sargasso {
	constructor (elem, options) {
		super(elem, options)
		this.endpoint = this.element.getAttribute('data-endpoint')
	}

	start () {
		super.start()
		this.load()
	}

	sleep () {

	}

	async load () {
		const payload = {}

		try {
			const request = await fetch(this.endpoint, {
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(payload)
			})

			const data = await response.json()
			this.jqElement.html('<pre>' + JSON.stringify(data, '', 2) + '</pre>')
		} catch (e) {
			CMSUtils.flashAjaxStatus('error', e.message || 'error')
		}
	}
}

utils.registerSargassoClass('digitopiaAnalyticsReport', digitopiaAnalyticsReport)

export {
	digitopiaAnalyticsReport
}
