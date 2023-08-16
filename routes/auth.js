const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { reset } = require("nodemon");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "shaizyisagoodb$oy"

// Route 1: create a user using: POST "/api/auth/createuser". No login required
router.post("/createuser", [
  body("name", "Name must have atleast 3 characters").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
], async (req, res) => {
  // console.log(req.body);
  // const user = User(req.body);
  // user.save();
  // res.send("Hello");

  // if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const success = false
    //Check  wheter the user with this email exists already
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      res.status(400).json({ success, error: "sorry a user with this email already exists" })
    }
    //password hash
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    //Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    //jsonwebtoken
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    // res.send(user);
    res.send({ success: true, authToken });

  } catch (error) {
    console.error(error.message)
    res.status(500).send("InternalServer Error")
  }


  // .then((user) => res.json(user))
  //   .catch(err => {
  //     console.log("Error:: ", err)
  //     res.json({ error: "Please send unique data", message: err.message })
  //   });
}
);


// Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password cannot be blanked").exists()
], async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body    //destructuring email & password from request body

  try {
    let success = false;
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    res.send({ success: true, authToken })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "InternalServer Error" })
  }
})

// Route 3: Get loggedin user details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "Internal server error" })
  }
})

module.exports = router;
