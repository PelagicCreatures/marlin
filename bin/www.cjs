const app = require('../app-tests.cjs')

const http = require('http')
app.start(() => {
	server = http.createServer(app)
	const listener = server.listen(3000)
})
