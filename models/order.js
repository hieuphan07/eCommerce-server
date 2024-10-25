const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderShema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	contact: {
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: Number,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	items: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
		},
	],
	total: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('Order', orderShema);
