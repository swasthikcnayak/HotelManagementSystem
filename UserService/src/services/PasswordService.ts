import User from "../models/User";
import BaseError from "../utils/Error";
import { HttpStatusCode } from "../utils/ErrorCode";
import jwt from "jsonwebtoken";
import { DbEntry } from "../dto/PasswordDto";
import PasswordToken from "../models/PasswordToken";
import { RESET_PASSWORD_TOKEN, PASSWORD_RESET_URL } from "../config";
import { sendEmail } from "../utils/EmailDelivery";

export default class PasswordService {
  async forgotPassword(email: string): Promise<DbEntry> {
    const result: DbEntry = await User.findOne({ email: email })
      .then((doc) => {
        if (doc === null) {
          throw new BaseError(
            "BAD REQUEST",
            HttpStatusCode.BAD_REQUEST,
            JSON.stringify({ error: "Account not found" })
          );
        }
        const userId = doc._id.toString();
        const hash = this.generateHash(userId);
        return { hash, userId };
      })
      .catch((err) => {
        if (err instanceof BaseError) {
          throw err;
        }
        throw new BaseError(
          "INTERNAL SERVER ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          JSON.stringify({ error: `Internal server error : ${err.errmsg}` })
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

  async dbEntry(dbEntry: DbEntry) {
    const data = new PasswordToken({
      userId: dbEntry.userId,
      token: dbEntry.hash,
    });
    data.save().catch((err) => {
      throw new BaseError(
        "MONGO ERROR",
        HttpStatusCode.INTERNAL_SERVER,
        JSON.stringify({ error: `Internal server error : ${err.errmsg}` })
      );
    });
  }

  async generateLink(hash: string): Promise<string> {
    return PASSWORD_RESET_URL + `${hash}`;
  }

  async resetPassword(id: string, password: string) {
    await PasswordToken.findOne({ token: id })
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
          userDoc.password = password;
          userDoc.save();
          PasswordToken.deleteOne({ token: id }).catch((err) => {
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

  async sendLink(link: string, email: string) {
    sendEmail(link, email);
  }

  private generateHash(id: string) {
    return jwt.sign({ id: id }, RESET_PASSWORD_TOKEN);
  }
}
