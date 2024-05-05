import { EMAIL_VERIFICATION_SECRET, EMAIL_VERIFICATION_LINK } from "../config";
import { AccountRegistrationDto, UserDto } from "../dto/AccountDto";
import EmailToken from "../models/EmailToken";
import User from "../models/User";
import { sendEmail } from "../utils/EmailDelivery";
import BaseError from "../utils/Error";
import { HttpStatusCode } from "../utils/ErrorCode";
import { handleMongoError } from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";

export default class AccountService {
  async saveUser(
    accountRegistrationDto: AccountRegistrationDto
  ): Promise<UserDto> {
    const user = new User({ ...accountRegistrationDto });
    const result = await user
      .save()
      .then((doc) => {
        return {
          email: doc.email,
          phoneNumber: doc.phoneNumber,
          id: doc._id.toString(),
        };
      })
      .catch((err) => {
        handleMongoError(err);
      });
    if (!result) {
      throw new BaseError(
        "INTERNAL SERVER ERROR",
        HttpStatusCode.INTERNAL_SERVER,
        JSON.stringify({ error: "Failure" })
      );
    }
    return result;
  }

  async beginVerification(userDto: UserDto) {
    const hash = this.generateHash(userDto.id);
    const URL = this.generateLink(hash);
    const data = new EmailToken({
      userId: userDto.id,
      token: hash,
    });
    data.save().catch((err) => {
      throw new BaseError(
        "MONGO ERROR",
        HttpStatusCode.INTERNAL_SERVER,
        JSON.stringify({ error: `Internal server error : ${err.errmsg}` })
      );
    });
    sendEmail(URL, userDto.email);
  }

  async verifyAccount(id: string) {
    await EmailToken.findOne({ token: id })
      .then((doc) => {
        if (doc == null) {
          throw new BaseError(
            "NOT FOUND",
            HttpStatusCode.NOT_FOUND,
            JSON.stringify({ error: "token not found" })
          );
        }
        User.findById(doc.userId).then((userDoc) => {
          if (userDoc == null) {
            throw new BaseError(
              "NOT FOUND",
              HttpStatusCode.NOT_FOUND,
              JSON.stringify({ error: "user not found" })
            );
          }
          userDoc.verified = true;
          userDoc.save();
          EmailToken.deleteOne({ token: id }).catch((err) => {
            console.log(err);
          });
        });
      })
      .catch((err) => {
        if (err instanceof BaseError) {
          throw err;
        }
        throw new BaseError(
          "MONGODB ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          JSON.stringify({ error: `Internal server error ${err.errmsg}` })
        );
      });
  }

  private generateHash(id: string) {
    return jwt.sign({ id: id }, EMAIL_VERIFICATION_SECRET);
  }
  private generateLink(hash: string): string {
    return EMAIL_VERIFICATION_LINK + `${hash}`;
  }
}
