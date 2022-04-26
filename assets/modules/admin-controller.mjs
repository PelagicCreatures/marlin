import {
	Sargasso, utils
}
	from '@pelagiccreatures/sargasso'


import { loadPage, tropicBird, flashAjaxStatus } from './utils'

class adminController extends Sargasso {
	constructor (elem, options) {
		super(elem, options)
		this.mountpoint = this.element.getAttribute('data-mountpoint')
		this.model = this.element.getAttribute('data-model')
		this.id = this.element.getAttribute('data-id')
		this.redirect = this.element.getAttribute('data-redirect')
	}

	start () {
		super.start()

		this.on('click', '.add-button', (e, elem) => {
			e.preventDefault()
			const target = elem.getAttribute('data-target')
			if (target) {
				const belongsTo = elem.getAttribute('data-belongs-to')
				const fk = elem.getAttribute('data-fk')
				loadPage(this.mountpoint + '/' + target + '/create?fk=' + fk + '&belongs-to=' + belongsTo)
			} else {
				loadPage(this.mountpoint + '/' + this.model + '/create')
			}
		})

		this.on('click', '.edit-button', (e, elem) => {
			e.preventDefault()
			loadPage(this.mountpoint + '/' + this.model + '/' + this.id + '/edit')
		})

		this.on('click', '.delete-button', (e, elem) => {
			e.preventDefault()
			tropicBird.dialog('#confirm-dialog', 'Delete this row?', this.confirmPrompt, true).then((action) => {
				if (action === 'accept') {
					const endpoint = this.mountpoint + '/' + this.model + '/' + this.id
					this.API('DELETE', endpoint)
				}
			})
		})

		this.on('click', '.search-button', (e, elem) => {
			e.preventDefault()
			const q = elem.closest('.input-group').find('input[name="q"]').val()
			const prop = elem.closest('.input-group').find('select[name="property"]').val()
			if (q && prop) {
				loadPage(location.pathname + '?q=' + encodeURIComponent(q) + '&property=' + encodeURIComponent(prop))
			}
		})

		this.on('mouseover', '.select-row', (e, elem) => {
			utils.elementTools.addClass(elem, 'hovering')
		})

		this.on('mouseout', '.select-row', (e, elem) => {
			utils.elementTools.removeClass(elem, 'hovering')
		})

		this.on('click', '.select-row', (e, elem) => {
			e.preventDefault()
			const id = parseInt(elem.getAttribute('data-row'))
			loadPage(this.mountpoint + '/' + this.model + '/' + id)
		})
	}

	sleep () {
		this.off('click', '.flextable-row')
		this.off('click', '.add-button')
		this.off('click', '.edit-button')
		this.off('click', '.delete-button')
		this.off('click', '.search-button')
		this.off('mouseover', '.select-row')
		this.off('mouseout', '.select-row')
		this.off('click', '.select-row')
		super.sleep()
	}

	API (method, endpoint, data) {
		fetch(endpoint, {
			method: method,
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Sargasso-Hijax': 'true'
			}
		}).then((response) => {
			return response.json()
		}).then((data) => {
			const flashLevel = data.flashLevel
			const flashMessage = data.flashMessage
			if (data.status === 'ok') {
				flashAjaxStatus('success', flashMessage)
				let redir = this.redirect
				if (data.id && !redir.match(/\/\d+$/)) {
					redir += '/' + data.id
				}
				loadPage(redir)
			} else {
				let message
				if (data.errors) {
					for (let i = 0; i < data.errors.length; i++) {
						if (message) {
							message += ', '
						}
						message += data.errors[i]
					}
				} else {
					message = data.status
				}
				this.element.querySelector('.ajax-errors').innerHTML = '<div class="ajax-message ajax-message-' + flashLevel + '"><i class="material-icons">info</i> ' + flashMessage + '</div>'
			}
		}).catch((e) => {
			const message = 'error'
			this.element.querySelector('.ajax-errors').innerHTML = '<div class="ajax-message ajax-message-error"><i class="material-icons">error</i> ' + message + '</div>'
		})
	}
}

utils.registerSargassoClass('adminController', adminController)

export {
	adminController
}
