import React, { useState } from "react"

export const defaultSession = {
    email: "",
    family_name: "",
    given_name: "",
    picture: "",
    access_token: "",
    refresh_token: "",
    tokinExpirationDate: ""
}

const SESSION_STORAGE_KEY = "userSession";

export const SessionContext = React.createContext();

export function UserSession(props) {
    const [userSession, setUserSession] = useState(sessionStorage.getItem(SESSION_STORAGE_KEY) ?? defaultSession)

    const handleUserSessionUpdate = (newContext) => {
        setUserSession(newContext)

        if (newContext.access_token !== "") {
            startSession(newContext)
        } else {
            deleteSession()
        }
    }

    const startSession = (newContext) => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newContext))
    }

    const deleteSession = () => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }

    return (<SessionContext.Provider value={{ userSession, handleUserSessionUpdate }}>{props.children}</SessionContext.Provider>)
}