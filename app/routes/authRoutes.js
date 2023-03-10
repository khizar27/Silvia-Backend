'use strict'

const express = require('express')
const router = express.Router()
const {signup, login, accountVerify, changePassword} = require('../controllers/userControllers')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/verify-account').get(accountVerify)
router.route('/changePassword').post(changePassword)

module.exports = router;