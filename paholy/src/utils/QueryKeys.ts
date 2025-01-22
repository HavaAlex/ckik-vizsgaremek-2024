const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
}

const MARKS_KEYS = {
    getMarks: 'getMarks',
    
}

export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...MARKS_KEYS,
} as const 