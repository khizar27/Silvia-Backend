'use strict'

const express = require('express')
const router = express.Router()
const {authenticateToken }= require('../middlewares/authMiddlewares')
const { campaign, AdSet, listOfcampaigns, getAdCategory, insertAdCategory, getAdObjects, insertAdObject } = require('../controllers/marketingCampaignController')

router.route('/campaign').post(campaign)
router.route('/campaign').get(listOfcampaigns)
router.route('/add-adset').post(AdSet)
router.route('/getAdCategory').get(getAdCategory)
router.route('/insertAdCategory').post(insertAdCategory)
router.route('/getAdObjects').get(getAdObjects)
router.route('/insertAdObject').post(insertAdObject)

module.exports = router;