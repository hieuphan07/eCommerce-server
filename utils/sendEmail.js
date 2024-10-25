const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.USER_PASSWORD,
	},
});

const sendEmail = async (email, order) => {
	const templatePath = path.join(
		__dirname,
		'..',
		'views',
		'ordered-products.ejs'
	);
	const parsedItems = order.items.map((item) => {
		return {
			productId: {
				...item.productId._doc,
				price:
					Number(item.productId.price).toLocaleString('en', {
						useGrouping: true,
					}) +
					' ' +
					'VND',
			},
			amount:
				Number(item.amount).toLocaleString('en', { useGrouping: true }) +
				' ' +
				'VND',
			quantity: Number(item.quantity),
		};
	});
	const parsedOrder = {
		...order._doc,
		items: parsedItems,
		total:
			Number(order._doc.total).toLocaleString('en', {
				useGrouping: true,
			}) +
			' ' +
			'VND',
	};
	ejs.renderFile(templatePath, { order: parsedOrder }, (err, html) => {
		if (err) {
			console.log(err);
			return;
		}

		const mailOptions = {
			from: '"hieuphan07" <hieuphan07@gmail.com>',
			to: email,
			subject: 'Your Order',
			html: html, // HTML content generated from the template
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Error sending email:', error);
			} else {
				console.log('Email sent:', info.response);
			}
		});
	});
};

exports.sendEmail = sendEmail;
