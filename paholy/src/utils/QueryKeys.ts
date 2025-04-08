const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset',
    ChangePassword:'ChangePassword',
    Login:'Login'
}

const ORAREND_KEYS = {
    getOrarend: 'getOrarend',
    getTeachers: 'getTeachers',
}

const SZULO_KEYS = {
    getChildren: 'getChildren',
}


const UZENETEK_KEYS = {
    getUzenetek: 'getUzenetek',
    getPotentialReceivers: 'getPotentialReceivers',
    getAllUzenetek:'getAllUzenetek'
}

const HIANYZASOK_KEYS = {
    getHianyzasok: 'getHianyzasok',
    getLessons: 'getLessons',
    getStudentsInGroup: 'getStudentsInGroup',
    postAbsence: 'postAbsence',
}
const JEGYEK_KEYS = {
    getJegyek: 'getJegyek',
    getTeacherGroups:"getTeacherGroups",
    getGroupMarks:'getGroupMarks',
    getSubjects:'getSubjects',
    getMembers:'getMembers',
    postJegyek:'postJegyek'
}

const HAZIK_KEYS = {
        getGroups: 'getGroups',
        addAssignment: 'addAssignment',
        uploadAssignmentFiles: 'uploadAssignmentFiles',
        uploadCompletedAssignmentFiles: 'uploadCompletedAssignmentFiles',
        getAssignmentsTeacher: 'getAssignmentsTeacher',
        getAssignmentsStudent: 'getAssignmentsStudent',
        getAssignmentFiles: 'getAssignmentFiles',
        getCompletedAssignmentFiles: 'getCompletedAssignmentFiles',
        modifyCompletedAssignment: 'modifyCompletedAssignment',
        deleteAssignment:'deleteAssignment',
        deleteAnswerFile:'deleteAnswerFile'
}

const ADMIN_KEYS = {
    addTeacherUsers: 'addTeacherUsers',
    addStudentUsers: 'addStudentUsers',
    addGuardianUsers: 'addGuardianUsers',
    getUsers: 'getUsers',
    getUser: 'getUser',
    modifyUser: 'modifyUser',
    deleteUser: 'deleteUser',
    getGroups: 'getGroups',
    CreateGroup:'CreateGroup',
    getGroupAsignments:'getGroupAsignments',
    getTimetable:'getTimetable',
    getAllGroups:'getAllGroups',
    getAllTeachers:'getAllTeachers',
    getAbsences:'getAbsences',
    getStudents:'getStudents',
    deleteAbsence: 'deleteAbsence',
    modifyAbsence: 'modifyAbsence',
    AddUsersToGroup:'AddUsersToGroup',
    AddStudentsToGuardians:'AddStudentsToGuardians',
    deleteStudentGroup:'deleteStudentGroup',
    deleteGroup:'deleteGroup',
    deleteLesson:'deleteLesson',
    addLessons:'addLessons',
    modifyLesson:'modifyLesson',
    addDisruption:'addDisruption',
    useDeleteAbsence:'useDeleteAbsence',
    useModifyAbsence:'useModifyAbsence',
    getAllMarks:'getAllMarks',
    deleteMark:'deleteMark'

}
export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...ORAREND_KEYS,
    ...UZENETEK_KEYS,
    ...HIANYZASOK_KEYS,
    ...JEGYEK_KEYS,
    ...HAZIK_KEYS,
    ...SZULO_KEYS,
    ...ADMIN_KEYS,
} as const 