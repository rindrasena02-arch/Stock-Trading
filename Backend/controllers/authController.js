const bcrypt = require("bcryptjs");
const { StockUser } = require("../models/model.js");
const generateToken = require("../utils/generateToken.js");

const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    if (await StockUser.findOne({ email })) {
      return res
        .status(400)
        .send("You already have an account with this email");
    }

    const user = new StockUser({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const u = await user.save();
    const token = generateToken(u._id);

    res.status(200).json({ user: u, token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Error");
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const dbuser = await StockUser.findOne({ email });

    if (!dbuser) {
      return res.status(404).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, dbuser.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = generateToken(dbuser._id);
    res.status(200).json({ user: dbuser, token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Error");
  }
};

module.exports = { Register, Login };
