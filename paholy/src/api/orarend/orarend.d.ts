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


export type Group = {
    ID: number,
    name: string
}