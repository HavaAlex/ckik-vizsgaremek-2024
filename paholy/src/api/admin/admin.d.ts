export type Teacher = {
    ID: number
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

export type Disruption = {
    ID: number,
    date:Date,
    groupID: number,
    teacherID: number,
    start_Hour: number,
    start_Minute: number,
    length: number,
    day: string,
    subjectName: string,
}
