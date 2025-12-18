import { LocalUser, CloudUser } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { EMAILREGAX, PASSWORDREGAX, SECRET } from "../utils/variable.js";
import jwt from "jsonwebtoken";

const registerUser = async (formData) => {
  try {
    const { email, password, role } = formData;

    if (!EMAILREGAX.test(email)) {
      throw new Error("Email not in correct pattern or incorrect email.");
    }

    if (PASSWORDREGAX.test(password)) {
      throw new Error("Password is not order in correct order.");
    }

    const hashPassword = await bcrypt.hash(password, 20);

    const newUser = new CloudUser({
      email: email,
      password: hashPassword,
      role: role,
    });

    if (!newUser) {
      throw new Error("Failed to error create new user.");
    }

    await newUser.save();

    const user = await CloudUser.findOne({ email: email });

    if (!user) {
      throw new Error("User not found.");
    }

    const secret = jwt.sign({ email: user.email, role: user.role }, SECRET, {
      expiresIn: "7d",
    });

    user.secretCode = secret;

    await user.save();

    return { success: true, message: "User created." };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export {registerUser}