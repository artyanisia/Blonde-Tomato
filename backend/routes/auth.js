const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Professor = require("../models/professor");
const Student = require("../models/student");
const sequelize = require("../sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "jwt_long_secret_key";

//creates new account and role (Professor / Student)

router.post("/register", async (req, res, next) => {
  const { email, password, name, role } = req.body;

  console.log("Register request received:", {
    email,
    password: "***",
    name,
    role,
  });

  if (!email || !password || !name || !role) {
    console.error("Missing required fields");
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await sequelize.transaction(async (t) => {
      const user = await User.create(
        {
          email,
          password: hashedPassword,
          name,
          role,
        },
        { transaction: t }
      );

      if (role === "Professor") {
        await Professor.create(
          {
            userId: user.id,
            maxStudents: 10,
            currentStudentsCount: 0,
          },
          { transaction: t }
        );
      } else if (role === "Student") {
        await Student.create(
          {
            userId: user.id,
            hasCoordinator: false,
          },
          { transaction: t }
        );
      }
      return user;
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
});

//verifies user identity and emits a token JWT

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "password", "name", "role"],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      userId: user.id,
      role: user.role,
      name: user.name,
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Error during login: ", err);
    next(err);
  }
});

module.exports = router;
