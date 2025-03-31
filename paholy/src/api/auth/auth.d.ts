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

export type changePasswordData = {
    username:string,
    currentPassword:string,
    currentPasswordAgain:string,
    newPassword:string
}

export type Assignment = {
    Groups: any[];  
    Description: string;
    DeadLine: Date;
    UploadDate: Date;
};
