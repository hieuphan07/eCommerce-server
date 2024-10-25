exports.isAuth = async (req, res, next) => {
	if (req.session.user) {
		console.log('Authenticated');
		return next();
	} else {
		return res.status(401).json({ error: { message: 'Not Authenticated' } });
	}
};

exports.isAdmin = async (req, res, next) => {
	if (req.session.user?.isAdmin) {
		return next();
	} else {
		return res.status(403).json({ error: { message: 'Not Authenticated' } });
	}
};
