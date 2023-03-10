'use strict'

const express = require('express')
const router = express.Router()
const { addMenuLinks, createMenu, getMenuLinks, getMenues, getMenueDetail } = require('../controllers/menuController')

router.route('/add-menu-links').post(addMenuLinks)
router.route('/creat-menu').post(createMenu)
router.route('/get-menu-links').get(getMenuLinks)
router.route('/get-menues').get(getMenues)
router.route('/get-menu-details').post(getMenueDetail)


module.exports=router;