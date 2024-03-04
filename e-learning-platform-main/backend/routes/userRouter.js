const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const permissions = require("../../resources/Permissions")
const hasPermission = require("../middleware/hasPermission")
const userPermissions = permissions.userPermissions

// routes that need only jwt validation
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgot', userCtrl.forgotPassword)
router.post('/reset', auth, userCtrl.resetPassword)
router.get('/logout', userCtrl.logout)
router.get('/infor', auth, userCtrl.getUserInfor)

// routes which need specific permissions (more than jwt validation)
router.get('/all_infor', auth, hasPermission(userPermissions.SEE_ALL_USERS), userCtrl.getUsersAllInfor)
router.put('/update', auth, userCtrl.updateUser)
router.put('/update_roles/:id', auth, hasPermission(userPermissions.UPDATE_USER), userCtrl.updateUserRoles)
router.get('/roles/:id', hasPermission(userPermissions.VIEW_USER), userCtrl.getUserRoles)
router.delete('/delete/:id', auth, hasPermission(userPermissions.DELETE_USER), userCtrl.deleteUser)

module.exports = router