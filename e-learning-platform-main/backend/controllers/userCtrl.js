const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { CLIENT_URL } = process.env;

const userCtrl = {
  register: async (req, res) => {
    console.log("Registering...");
    console.log(req.body);

    try {
      const { name, email, password, isTeacher, description, headline } =
        req.body;
      console.log("name =" + name + "email = " + email + password + isTeacher);
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid email" });

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({ name, email, password: passwordHash, roles: ["student"] });
      await newUser.save();
    
      res.json({ msg: "Register Successful! Please login to start." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await Users.findOne({
        email: { $regex: email, $options: "i" },
      });
      if (!existingUser)
        return res.status(400).json({ msg: "That Email doesn't exist." });
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ msg: "Invalid credentials" });

      const refresh_token = createRefreshToken({ id: existingUser._id,  roles: existingUser.roles});
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 365 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ msg: "Login success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: async (req, res) => {
    try {
      //http://localhost:5000/user/refresh_token
      //get theCookie value
      const rf_token = req.cookies.refreshtoken;
      //console.log(rf_token)
      if (!rf_token) return res.status(500).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(500).json({ msg: "Please login now!" });
        const access_token = createAccessToken({ id: user.id, roles: user.roles });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      /* forgotPassword: if click to forgotPwd btn  - we  send a email  and a req with the token_code(user)
       */
      console.log("forgot pass");
      const { email } = req.body;
      const existingUser = await Users.findOne({ email });
      if (!existingUser)
        return res.status(400).json({ msg: "That Email doesn't exist." });

      const access_token = createAccessToken({ id: existingUser._id, roles: existingUser.roles });
      const url = `${CLIENT_URL}user/reset/${access_token}`;

      sendMail(email, url, existingUser.name, "Reset your password");
      res.json({
        msg: "Re-send the password, please check your email inbox or spam.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message }); //err
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );
      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      console.log(user);
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsersAllInfor: async (req, res) => {
    try {
      const user = await Users.find().select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar, description, headline } = req.body;
      console.log("req body user", req.body);
      const user = await Users.findById(req.user.id);
      console.log("find the user", user);
      if (user) {
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.description = description || user.description;
        user.headline = headline || user.headline;
      }
      const updatedUser = await user.save();
      res.json({ msg: "Update User Success!" });
      console.log("Update of user info success");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserRoles: async (req, res) => {
    try {
      // todo: de verificat ca rolurile exista in lista de roluri
      // daca unul din roluri nu exista => eroare
      const newRoles = req.body.new_roles;
      if(newRoles == null || newRoles == []) {
        return res.status(500).json({ msg: "Roles list cannot be empty or null!" });
      }

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        { roles: newRoles }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserRoles: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      console.log(user);
      res.json({ roles: user.roles });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: "365d",
  });
};
module.exports = userCtrl;
