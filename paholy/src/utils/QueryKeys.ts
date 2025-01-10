const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
}

export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
} as const