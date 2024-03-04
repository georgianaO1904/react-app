const Users = require('../models/userModel')
const Role = require("../models/roleModel");
const jwt_decode = require("jwt-decode");

const resolveAllPermissions = (roles) => {
  const promises = roles.map(async (currentRole) => {
  const dbRole = await Role.findOne({ role: currentRole });
  
    if(dbRole != null) {
      return dbRole.permissions;
    } else return;
  });
  return Promise.all(promises);
}

const hasPermission = (action) => {
  return async (req, res, next) => {

    const token = req.header("Authorization");
    console.log("access token from cookies = " + token);

    var decodedToken = jwt_decode(token, {complete: true}); 
    console.log(decodedToken);

    // if exists, we extract user roles directly from the jwt header
    const roles = decodedToken.roles != undefined ? decodedToken.roles : await Users.findOne({_id: req.user.id}).roles
  
    console.log("roles = ")
    console.log(roles)

    if(roles != null) {
      const permissions = await resolveAllPermissions(roles);
      const permissionsList = String(permissions).split(",");
  
      console.log("all permissions = " + permissionsList)
  
      const allowed = permissionsList.includes(action);
      allowed ? next() : res.status(403).send("Forbidden, you don't have the rights to access this resource").end();
    } else {
      res.status(403).send("Server error, you are not logged in!").end();
    }
  };
};

module.exports = hasPermission
