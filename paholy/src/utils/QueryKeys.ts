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

const UZENETEK_KEYS = {
    getUzenetek: 'getUzenetek',
}

export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...ORAREND_KEYS,
    ...UZENETEK_KEYS
} as const 