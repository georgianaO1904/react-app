const router = require('express').Router()
const rolesCtrl = require('../controllers/roleControler')
const auth = require('../middleware/auth')
const isAdmin = require("../middleware/isAdmin")

// only the admin can update user roles
router.get("/", auth, isAdmin, rolesCtrl.getAllRoles);
router.get("/:id", auth, isAdmin, rolesCtrl.getRoleById);
router.post('/add_role', auth, isAdmin, rolesCtrl.addRole)
router.delete('/delete_role/:id', auth, isAdmin, rolesCtrl.deleteRole)

module.exports = router