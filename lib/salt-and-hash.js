const bcrypt = require('bcryptjs');

module.exports = (marlin) => {
	function saltAndHash(plaintext) {
		var salt = bcrypt.genSaltSync(marlin.options.DEFAULT_SALT_ROUNDS);
		return bcrypt.hashSync(plaintext, salt);
	}
	return saltAndHash;
};
