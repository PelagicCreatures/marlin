import Cookies from 'js-cookie'

import {
	utils, loadPageHandler
}
	from '@pelagiccreatures/sargasso'

import {
	TropicBird
}
	from '@pelagiccreatures/tropicbird'

import '@pelagiccreatures/flyingfish'

import '@pelagiccreatures/molamola'

let loadPage, reloadPage, tropicBird

const bootCMS = () => {
	tropicBird = new TropicBird(document.body, {})
	tropicBird.start()

	loadPage = (url) => {
		loadPageHandler(url)
	}

	reloadPage = () => {
		loadPageHandler(document.location.href, true)
	}

	if (Cookies.get('have-account')) {
		utils.elementTools.addClass(document.body, 'have-account')
	} else {
		utils.elementTools.addClass(document.body, 'dont-have-account')
	}

	// Set initial login state css show/hide behavior
	if (Cookies.get('logged-in')) {
		didLogIn()
	} else {
		didLogOut()
	}

	window.setTimeout(function () {
		utils.elementTools.addClass(document.querySelector('#splash'), 'animate__animated')
		utils.elementTools.addClass(document.querySelector('#splash'), 'animate__fadeOut')
	}, 500)

	utils.elementTools.on('notifications-button', document.body, 'click', '.show-notifications-button', (e) => {
		if (utils.elementTools.hasClass(e.target, 'highlight')) {
			utils.elementTools.removeClass(e.target, 'highlight')
			utils.elementTools.removeClass(document.querySelector('#user-alerts'), 'open')
		} else {
			utils.elementTools.addClass(e.target, 'highlight')
			utils.elementTools.addClass(document.querySelector('#user-alerts'), 'open')
		}
	})
}

// call whenever login occurs
function didLogIn () {
	checkSubscription()
	Cookies.set('have-account', 1, cookieOptions)
	flashAjaxStatus('success', 'Logged in')
	utils.elementTools.removeClass(document.body, 'is-logged-out')
	utils.elementTools.addClass(document.body, 'is-logged-in')
	utils.elementTools.addClass(document.body, 'have-account')
}

// call whenever logout occurs
const didLogOut = () => {
	checkSubscription()
	if (Cookies.get('have-account')) {
		flashAjaxStatus('success', 'Logged out')
	}
	utils.elementTools.removeClass(document.body, 'is-logged-in')
	utils.elementTools.addClass(document.body, 'is-logged-out')
	Cookies.remove('access_token', cookieOptions)
}

const checkSubscription = () => {
	if (Cookies.get('subscriber')) {
		utils.elementTools.removeClass(document.body, 'not-subscriber')
		utils.elementTools.addClass(document.body, 'is-subscriber')
	} else {
		utils.elementTools.removeClass(document.body, 'is-subscriber')
		utils.elementTools.addClass(document.body, 'not-subscriber')
	}

	if (Cookies.get('admin')) {
		utils.elementTools.removeClass(document.body, 'not-admin')
		utils.elementTools.addClass(document.body, 'is-admin')
	} else {
		utils.elementTools.removeClass(document.body, 'is-admin')
		utils.elementTools.addClass(document.body, 'not-admin')
	}

	if (Cookies.get('superuser')) {
		utils.elementTools.removeClass(document.body, 'not-superuser')
		utils.elementTools.addClass(document.body, 'is-superuser')
	} else {
		utils.elementTools.removeClass(document.body, 'is-superuser')
		utils.elementTools.addClass(document.body, 'not-superuser')
	}
}

// call to show the Material Design "snackbar" for user notifications
const flashAjaxStatus = (level, message) => {
	tropicBird.pushSnackBar(level, message)
}

export {
	bootCMS,
	didLogIn,
	didLogOut,
	checkSubscription,
	flashAjaxStatus,
	loadPage,
	reloadPage,
	tropicBird
}
