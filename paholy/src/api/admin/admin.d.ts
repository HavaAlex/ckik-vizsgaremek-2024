export type Teacher = {
    name: string,
    phone: string,
    email: string,
    birth_Date: Date,
} 

export type Student = {
    name: string,
    birth_Date: Date,
    address: string,
    phone: string,
    email: string,
    OM_ID: string
}

export type Guardian = {
    name: string,
    birth_Date: Date,
    address: string,
    phone: string,
    email: string,
    RelatedStudents: number[]
}

export type CreatedGroup = {
    name: string,
    StudentOMIDs: number[]
}