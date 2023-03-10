'use strict'

const express = require('express')
const router = express.Router()
const { addRole, addPermission, getRoles, getPermission, getAllUsers, assignRolePermission, getUserRole, assignUserRole } = require('../controllers/accessController')
const {isAuthenticatedUser, authenticateToken} = require('../middlewares/authMiddlewares')

router.route('/add-role').post(addRole)
router.route('/add-permission').post(addPermission)
router.route('/get-roles').get(authenticateToken,getRoles)
router.route('/get-permisions').get(getPermission)
router.route('/all-users').get(getAllUsers)
router.route('/assign-role-permisions').post(assignRolePermission)
router.route('/assign-user-role').post(assignUserRole)
router.route('/get-user-role').post(getUserRole)


module.exports = router;