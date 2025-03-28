const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
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
        postAssignment: 'postAssignment',
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
    getAbsences:'getAbsences',
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