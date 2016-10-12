'use scrict'

const Joi = require('joi')

module.exports.before = Joi.object().keys({
  email: Joi.string().email().required(),
  createdAt: Joi.date()
})
