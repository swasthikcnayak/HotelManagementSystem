import { NextFunction, Request, Response } from "express"
import { LoginDto } from "../dto/AuthDto"
import AuthService from "../services/AuthService"


export default class AuthController {
    authService = new AuthService();

    public async login(req: Request, res: Response, next: NextFunction) {
        const loginDto = req.body as LoginDto;
        try {
            const authInfo = await this.authService.verifyUser(loginDto);
            const access_token = this.authService.generateAccessToken(authInfo);
            res.status(200).json({
                access_token,
                expires_in: '30m',
                message: "Logged in successfull"
            }).end();
        } catch (e) {
            next(e)
        }
    }



    public logout(req: Request, res: Response, next: NextFunction): void {
        // TODO: HAS TO BE IMPLEMENTED - JWT TOKEN IS STATELESS, NEEDS TO BE DELETED FROM BROWSER
        res.status(200).json({result: "OK"})
    }
}