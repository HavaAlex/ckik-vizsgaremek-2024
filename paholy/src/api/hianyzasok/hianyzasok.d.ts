export type HianyzasValasz = {
    data:[]
}
export type Teacher = {
    ID: number,
    name: string,
    phone: string,
    email: string,
}

export type Students = {
    ID: number,
    name: string,
    DoB : Date,
    address: string,
    phone: string,
    email: string,
    userId: number,
    OMID: number,
}


export type Hianyzaskapo ={
    Datum: Date,
    KezdesIdo: Date, 
    IgazolasStatusza: string,
    Subject:string,
    keses: number,
}

export type Hianyzas = {
    ID: number,
    studentID: number,
    teacherID: number,
    lessonID: number,
    date: date,
    excused: boolean
}

export type Lesson = {
    ID: number,
    groupID: number,
    teacherID: number,
    start_Hour: number,
    start_Minute: number,
    length: number,
    day: string,
    subjectName: string,
    excused: boolean
}

export type GroupMembers ={
    groupName:string,
    members:GroupMember[],
}

export type Absence = {
    studentID: number,
    teacherID: number,
    lessonID: number,
    date: Date,
    absent: boolean
}