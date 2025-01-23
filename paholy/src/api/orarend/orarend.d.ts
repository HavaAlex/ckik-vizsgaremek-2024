export type LessonAttributes = {
    subject: string,
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
    oraId: number,
    feladatId: []
}

export type CustomOrarend = {
    lessons: []
}

export type CustomLesson = {
    datum: Date,
    length: number,
    teacher: string,
    feladatId: []
}