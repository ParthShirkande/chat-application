export const HOST=import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES= "/api/auth"
export const SIGNUP_ROUTE= `${AUTH_ROUTES}/signup` 
export const LOGIN_ROUTE= `${AUTH_ROUTES}/login`

export const GET_USER_INFO= `${AUTH_ROUTES}/userInfo`

export const UPDATE_PROFILE_ROUTE= `${AUTH_ROUTES}/update-profile`

export const ADD_PROFILE_IMAGE_ROUTE= `${AUTH_ROUTES}/add-profile-image`

export const REMOVE_PROFILE_IMAGE_ROUTE= `${AUTH_ROUTES}/remove-profile-image`

export const LOGOUT_ROUTE= `${AUTH_ROUTES}/logout`



export const CONTACT_ROUTE= "api/contacts"
export const SEARCH_CONTACT_ROUTE= `${CONTACT_ROUTE}/search`
export const GET_CONTACTS_FOR_DM_ROUTE= `${CONTACT_ROUTE}/get-contacts-for-dm`
export const GET_ALL_CONTACTS_ROUTE= `${CONTACT_ROUTE}/get-all-contacts`


export const MESSAGE_ROUTE= "api/messages"
export const GET_MESSAGES_ROUTE= `${MESSAGE_ROUTE}/get-messages`
export const UPLOAD_FILE_ROUTE= `${MESSAGE_ROUTE}/upload-file`

export const CHANNEL_ROUTES="api/channel"
export const CREATE_CHANNEL_ROUTE= `${CHANNEL_ROUTES}/create-channel`
export const GET_USER_CHANNEL_ROUTE= `${CHANNEL_ROUTES}/get-user-channels`

export const GET_CHANNEL_MESSAGES= `${CHANNEL_ROUTES}/get-channel-messages`
