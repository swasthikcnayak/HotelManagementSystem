interface AccountRegistrationDto {
    email: string
    phoneNumber: string
    password: string
}

interface UserDto {
    id: string
    email: string
    phoneNumber: string
}

export { AccountRegistrationDto, UserDto }