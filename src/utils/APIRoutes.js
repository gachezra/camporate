const API_BASE_URL = 'https://some-laws-tickle.loca.lt/api';

// auth routes
export const registerRoute = `${API_BASE_URL}/register`
export const loginRoute = `${API_BASE_URL}/login`
export const verifyEmailRoute = `${API_BASE_URL}/verify-email`

//profile
export const getUserProfileRoute = `${API_BASE_URL}/profile`
export const updateUserRoute = `${API_BASE_URL}/update`
export const changePasswordRoute = `${API_BASE_URL}/request-password-reset`
export const passwordResetRoute = `${API_BASE_URL}/change-password`

//universities
export const getUniversityDetails = `${API_BASE_URL}/universities`
export const getUniversityNamesRoute = `${API_BASE_URL}/dropdown-universities`
export const getProgramsRoute = `${API_BASE_URL}/university-programs`
export const schoolEmailRoute = `${API_BASE_URL}/school-email`

//reviews
export const reviewRoute = `${API_BASE_URL}/reviews`
