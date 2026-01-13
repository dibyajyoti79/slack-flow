import logger from "../config/logger.config";
import { SigninDto, SignupDto } from "../dtos/user.dto";
import userRepository from "../repositories/user.repository";
import { BadRequestError } from "../utils/api-error";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const userService = {
  async signup(user: SignupDto) {
    logger.info("Signing up user");
    // check if user name or email already exist
    const existingUser = await userRepository.getByEmail(user.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    const existingUsername = await userRepository.getByUsername(user.username);
    if (existingUsername) {
      throw new BadRequestError("Username already exists");
    }
    const newUser = await userRepository.create(user);

    return {
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar,
    };
  },

  async signin(data: SigninDto) {
    logger.info("Signing in user");
    const existingUser = await userRepository.getByEmail(data.email);
    if (!existingUser) {
      throw new BadRequestError("Invalid email or password");
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid email or password");
    }
    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });
    return {
      name: existingUser.name,
      email: existingUser.email,
      username: existingUser.username,
      avatar: existingUser.avatar,
      token: token,
    };
  },
};

export default userService;
