export type SetPasswordResponse = {
    status: string,
    data: []
} 

export type SetPasswordData = {
    password: string,
    password_confirmation: string,
}

export type LoginData = {
    username:string,
    password:string
}

export type ResetPasswordData = {
    email:string
}