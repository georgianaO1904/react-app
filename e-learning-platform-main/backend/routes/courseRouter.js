const router = require("express").Router();
const coursesCtrl = require("../controllers/coursesCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const hasPermission = require("../middleware/hasPermission")
const permissions = require("../../resources/Permissions").coursePermissions

router.get("/searched", coursesCtrl.getcoursesSearched);

router.get("/checkmembership", auth, coursesCtrl.studentMembership);
router.get("/Coursesenrolled", auth, coursesCtrl.getcoursesenrolled);

router.get("/details/:id",  auth, hasPermission(permissions.SEE_COURSE), coursesCtrl.getcoursedetails);
router.put("/updatecourse/:id", auth, hasPermission(permissions.UPDATE_COURSE), coursesCtrl.updateCourse);
router.delete("/deletecourse/:id", auth, hasPermission(permissions.DELETE_COURSE), coursesCtrl.deleteCourse);
router.post("/addcourse", auth, hasPermission(permissions.ADD_COURSE), coursesCtrl.addCourse);

router.get("/Mycourses", auth, hasPermission(permissions.SEE_COURSE), coursesCtrl.getMycourses);
router.get("/Allcourses", auth, hasPermission(permissions.SEE_ALL_COURSES), coursesCtrl.getAllcourses);

router.post("/enroll/:id", auth, hasPermission(permissions.ENROLL_COURSE), coursesCtrl.enroll);

module.exports = router;
