const coursePermissions = {
  ADD_COURSE: 'add-course',
  UPDATE_COURSE: 'update-course',
  SEE_ALL_COURSES: 'see-all-courses',
  SEE_COURSE: 'see-course',
  DELETE_COURSE: 'delete-course',
  ENROLL_COURSE: 'enroll-course',
}

const userPermissions = {
  SEE_ALL_USERS: 'see-all-users',
  DELETE_USER: 'delete-user',
  UPDATE_USER: 'update-user'
}


module.exports = {
  coursePermissions: coursePermissions,
  userPermissions: userPermissions
}