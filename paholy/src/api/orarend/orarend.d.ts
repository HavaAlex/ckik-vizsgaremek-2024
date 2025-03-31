export type Lesson = {
    ID: number,
    groupID: number,
    teacherID: number,
    start_Hour: number,
    start_Minute: number,
    length: number,
    day: string,
    subjectName: string,
    excused: boolean,
    Teacher: TeacherName
}


export type Group = {
    ID: number,
    name: string
}

export type Teacher = {
    ID: number,
    name: string,
    phone: string,
    email: string,
}

export type TeacherName = {
    name: string
}