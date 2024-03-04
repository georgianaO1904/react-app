const Role = require("../models/roleModel");

const roleCtrl = {
  addRole: async (req, res) => {
    console.log("Adding new role ...");
    console.log(req.body);

    try {  

      const { role, permissions } = req.body;
        
      if (!role || !permissions)
        return res.status(400).json({ msg: "Please fill in all fields." });

      const role_exists = await Role.findOne({ role });

      if (role_exists)
        return res.status(400).json({ msg: "This role already exists." });

      const newRole = new Role({role: role, permissions: permissions});
      await newRole.save();

      res.json({
          msg: "Role added successfully.",
        });
      
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllRoles: async (req, res) => {
    const roles = await Role.find({});
    res.json(roles);
  },
  getRoleById: async (req, res) => {
    const role =  await Role.findById(req.params.id);
    res.json(role);
  },
  deleteRole: async (req, res) => {
    // todo: sa actualizez si userii care au acest rol -> le dau rolul default daca nu mai au alte roluri
    try {
      await Role.findByIdAndDelete(req.params.id);

      res.json({ msg: "Role deleted Successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = roleCtrl;
