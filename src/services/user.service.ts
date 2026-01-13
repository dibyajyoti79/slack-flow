import logger from "../config/logger.config";
import { SignupDto } from "../dtos/user.dto";
import userRepository from "../repositories/user.repository";
import { BadRequestError } from "../utils/api-error";

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
      ...newUser.toJSON(),
    };
  },
};

export default userService;
