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
}

const SZULO_KEYS = {
    getChildren: 'getChildren',
}


const UZENETEK_KEYS = {
    getUzenetek: 'getUzenetek',
    getPotentialReceivers: 'getPotentialReceivers'
}

const HIANYZASOK_KEYS = {
    getHianyzasok: 'getHianyzasok',
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
        modifyCompletedAssignment: 'modifyCompletedAssignment',

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
} as const 