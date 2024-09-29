const API_BASE_URL = 'https://campo-server.onrender.com/api';

// auth routes
export const registerRoute = `${API_BASE_URL}/register`
export const loginRoute = `${API_BASE_URL}/login`
export const verifyEmailRoute = `${API_BASE_URL}/verify-email`

//contact page
export const sendMessageRoute = `${API_BASE_URL}/sendMessage`

//profile
export const getUserProfileRoute = `${API_BASE_URL}/profile`
export const updateUserRoute = `${API_BASE_URL}/update`
export const changePasswordRoute = `${API_BASE_URL}/request-password-reset`
export const passwordResetRoute = (token) => `${API_BASE_URL}/change-password/${token}`
export const requestPasswordResetRoute = `${API_BASE_URL}/request-password-reset`
export const setAvatarRoute = (userId) => `${API_BASE_URL}/setAvatar/${userId}`

//universities
export const getUniversityDetails = `${API_BASE_URL}/universities`
export const getUniversityByIdRoute = `${API_BASE_URL}/universities`
export const getUniversityNamesRoute = `${API_BASE_URL}/dropdown-universities`
export const schoolEmailRoute = `${API_BASE_URL}/school-email`
export const addUniversityRoute = `${API_BASE_URL}/universities`

//branches
export const getBranchesRoute = (universityId) => `${API_BASE_URL}/branches/${universityId}/branches`
export const getBranchRoute = (branchId) => `${API_BASE_URL}/universities/${branchId}/branch`
export const addBranchRoute = (universityId, userId) => `${API_BASE_URL}/branches/${universityId}/${userId}/add`
export const updateBranchRoute = (branchId, userId) => `${API_BASE_URL}/branches/${branchId}/${userId}/update`
export const getProgramsRoute = (branchId) => `${API_BASE_URL}/branch-programs/${branchId}`

//reviews
export const reviewRoute = (universityId, branchId) => `${API_BASE_URL}/reviews/${universityId}/${branchId}`

//threads
export const createThreadRoute = (userId) => `${API_BASE_URL}/threads/${userId}`
export const getThreadsRoute = (userId) => `${API_BASE_URL}/threads/${userId}`
export const threadByIdRoute = (threadId) => `${API_BASE_URL}/threads/${threadId}` // put, delete & get
export const responseRoute = `${API_BASE_URL}/reviews/response`

//posts
export const createPostRoute = (userId) => `${API_BASE_URL}/posts/${userId}`
export const postByIdRoute = (postId) => `${API_BASE_URL}/posts/${postId}` //put & delete
export const getPostsRoute = (threadId, userId) => `${API_BASE_URL}/threads/${userId}/${threadId}/posts`
export const votePostRoute = (postId) => `${API_BASE_URL}/posts/${postId}/vote`
