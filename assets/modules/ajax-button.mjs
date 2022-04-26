import {
	Sargasso, utils
}
	from '@pelagiccreatures/sargasso'


import { didLogIn, didLogOut, flashAjaxStatus, reloadPage, loadPage, tropicBird } from './utils'

class ajaxButton extends Sargasso {
	constructor (elem, options) {
		super(elem, options)

		this.endpoint = this.element.getAttribute('data-endpoint')
		this.redirect = this.element.getAttribute('data-redirect') ? this.element.getAttribute('data-redirect') : '/users/home'
		this.method = this.element.getAttribute('data-method') ? this.element.getAttribute('data-method') : 'POST'
		this.confirm = this.element.getAttribute('data-confirm') ? this.element.getAttribute('data-confirm') : false
		this.confirmPrompt = this.element.getAttribute('data-confirm-prompt') ? this.element.getAttribute('data-confirm-prompt') : 'Are you sure?'
	}

	start () {
		super.start()
		this.on('click', '', async (e) => {
			e.preventDefault()
			if (this.confirm) {
				tropicBird.dialog('#confirm-dialog', 'Please Confirm', this.confirmPrompt, true).then(async (action) => {
					if (action === 'accept') {
						await this.doIt()
					}
				})
			} else {
				await this.doIt()
			}
		})
	};

	sleep () {
		this.off('click', '')
		super.sleep()
	};

	async doIt () {
		try {
			const response = await fetch(this.endpoint, {
				method: this.method,
				headers: {
					'Content-Type': 'application/json',
					'Sargasso-Hijax': 'true'
				}
			})

			const data = await response.json()
			const flashLevel = response.headers['Sargasso-Flash-Level'] ? response.headers['Sargasso-Flash-Level'] : data.flashLevel
			const flashMessage = response.headers['Sargasso-Flash-Message'] ? response.headers['Sargasso-Flash-Message'] : data.flashMessage
			const loggedIn = response.headers['Sargasso-Did-Login'] ? response.headers['Sargasso-Did-Login'] : data.didLogin
			const loggedOut = response.headers['Sargasso-Did-Logout'] ? response.headers['Sargasso-Did-Logout'] : data.didLogout

			if (loggedIn) {
				didLogIn()
			}

			if (loggedOut) {
				didLogOut()
			}

			if (data.status === 'ok') {
				flashAjaxStatus('success', flashMessage)
				if (this.redirect === location.pathname) {
					reloadPage()
				} else {
					loadPage(this.redirect)
				}
			} else {
				flashAjaxStatus(flashLevel, flashMessage)
			}
		} catch (e) {
			const message = 'error'
			flashAjaxStatus('error', message)
		}
	}
}

utils.registerSargassoClass('ajaxButton', ajaxButton)

export {
	ajaxButton
}
