const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");
const repo = require("./auth.repository");

exports.register = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("Username and password required", 400);
  }

  const existingUser = await repo.findUserByUsername(username);

  if (existingUser) {
    throw new AppError("Username already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await repo.createUser({
    username,
    password_hash: hashedPassword,
    role: "Staff",
  });

  return {
    message: "User registered",
    user,
  };
};

exports.login = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("Username and password required", 400);
  }

  const user = await repo.findUserByUsername(username);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    message: "Login successful",
    token,
  };
};