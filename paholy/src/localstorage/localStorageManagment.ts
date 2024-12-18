export function setUserStatusToLocalStorage(status : string) 
{
        const propertyName = "userStatus";
        const value = status;
        localStorage.setItem(propertyName, value);
}

export function getUserStatusFromLocalStorage() 
{
        return localStorage.getItem("userStatus");
}

