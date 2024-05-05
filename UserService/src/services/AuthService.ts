import { AuthInfoDto, LoginDto, RefreshTokenPayload } from "../dto/AuthDto";
import bcrypt from "bcrypt";
import User from "../models/User";
import BaseError from "../utils/Error";
import { HttpStatusCode } from "../utils/ErrorCode";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config";

export default class AuthService {
  async verifyUser(loginDto: LoginDto): Promise<AuthInfoDto> {
    const result = await User.findOne(
      { email: loginDto.email },
      { _id: 1, password: 1 }
    )
      .then((doc) => {
        if (doc == null || doc == undefined) {
          throw new BaseError(
            "INVALID CREDENTIALS",
            HttpStatusCode.UNAUTHORIZED,
            JSON.stringify({
              error:
                "Invalid email or password. Please try again with the correct credentials.",
            })
          );
        }
        const isPasswordValid = bcrypt.compare(loginDto.password, doc.password);
        if (!isPasswordValid) {
          throw new BaseError(
            "INVALID CREDENTIALS",
            HttpStatusCode.UNAUTHORIZED,
            JSON.stringify({
              error:
                "Invalid email or password. Please try again with the correct credentials.",
            })
          );
        }
        return { email: loginDto.email, id: doc._id.toString() };
      })
      .catch((err) => {
        throw new BaseError(
          "INTERNAL SERVER ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          JSON.stringify({ error: `Internal server error ${err.errmsg}` })
        );
      });
    if (!result)
      throw new BaseError(
        "INTERNAL SERVER ERROR",
        HttpStatusCode.INTERNAL_SERVER,
        JSON.stringify({ error: "Failure" })
      );
    return result;
  }

  public generateAccessToken(authInfoDto: AuthInfoDto): string {
    return jwt.sign({ id: authInfoDto.id }, SECRET_ACCESS_TOKEN, {
      expiresIn: "30m",
    });
  }
}
