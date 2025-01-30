export type LessonAttributes = {
    subject: string,
    teacher: string,
    startDate: Date,
    length: number
}


export type AlapOrarend = {
    lessons: []
}
export type Lesson = {
    nap: string,
    startTime: Date,
    length: number,
    teacher: string,
    subject: string,
    feladatId: []
}

export type CustomOrarend = {
    lessons: []
}

export type CustomLesson = {
    datum: Date,
    length: number,
    subject: string,
    teacher: string,
    feladatId: []
}

export type Group = {
    ID: number,
    name: string
}