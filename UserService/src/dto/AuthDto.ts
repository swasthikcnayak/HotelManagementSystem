interface LoginDto {
    email: string
    password: string
}

interface AuthInfoDto {
    email: string,
    id: string
}

interface AccessTokenPaload {
    id: string
}

interface RefreshTokenPayload {
    email: string
}



export { LoginDto, AuthInfoDto, AccessTokenPaload, RefreshTokenPayload }