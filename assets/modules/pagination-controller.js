import {
	Sargasso, utils
}
	from '@pelagiccreatures/sargasso'

class paginationController extends Sargasso {
	constructor (elem, options) {
		super(elem, options)
	}

	start () {
		let index
		const pages = this.element.querySelector('.pagination-page')
		const selipsis = this.element.querySelector('.pagination-elipsis-start')
		const eelipsis = this.element.querySelector('.pagination-elipsis-end')
		if (pages.length > 9) {
			for (let i = 0; i < pages.length; i++) {
				if (utils.elementTools.hasClass(pages[i], 'active')) {
					index = i
				}
			}
			let start = index - 4
			let end = index + 4

			if (start < 0) {
				end = -start + end
				start = 0
			}
			if (end > pages.length) {
				start = start + pages.length - end
				end = pages.length
			}
			for (let i = 0; i < pages.length; i++) {
				if (i < start || i > end) {
					pages[i].remove()
				}
			}
			if (start === 0) {
				selipsis.remove()
			}
			if (end + 2 > pages.length) {
				eelipsis.remove()
			}
		} else {
			selipsis.remove()
			eelipsis.remove()
		}
	};
}

utils.registerSargassoClass('paginationController', paginationController)

export {
	paginationController
}
