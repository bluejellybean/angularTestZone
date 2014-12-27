'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Blog Schema
 */
var BlogSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in Blog name',
		trim: true
	},
	content: {
		type: String,
		default: '',
		required: 'Please fill in content',
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Blog', BlogSchema);