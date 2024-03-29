const debug = require('debug')('marlin-user')

const {
  getUserForRequestMiddleware
} = require('../lib/get-user-for-request-middleware.cjs')

module.exports = (marlin) => {
  debug('mounting users API /logout')

  const db = marlin.db

  marlin.router.delete('/logout', getUserForRequestMiddleware(marlin), function (req, res) {
    debug('/logout')

    var currentUser = req.antisocialUser
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        errors: ['must be logged in']
      })
    }

    db.deleteInstance('Token', req.antisocialToken.id, function (err) {
      if (err) {
        return res.status(500).json({
          status: 'error',
          errors: [err.message]
        })
      }

      if (process.env.STRIPE_SECRET) {
        if (currentUser.stripeStatus === 'ok') {
          res.clearCookie('subscriber', {
            path: '/'
          })
        }
      }

      res.clearCookie('access-token', {
        path: '/',
        signed: true,
        httpOnly: true
      })
        .clearCookie('logged-in', {
          path: '/'
        })
        .send({
          status: 'ok',
          flashLevel: 'info',
          flashMessage: 'Bye.',
          didLogout: true
        })
    })
  })
}
