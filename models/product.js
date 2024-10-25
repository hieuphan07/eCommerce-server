const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	long_desc: {
		type: String,
		required: true,
	},
	short_desc: {
		type: String,
		required: true,
	},
	photos: [],
});

module.exports = mongoose.model('Product', productSchema);
