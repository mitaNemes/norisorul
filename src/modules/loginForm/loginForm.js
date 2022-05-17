import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./loginForm.scss";
import { getGoogleConsentUrl, getGoogleUser } from "./loginForm.service";
import { SessionContext } from "../../Session";
import { text } from "../text"

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function LoginForm() {
  const { userSession, handleUserSessionUpdate } = useContext(SessionContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);

  useEffect(() => {
    getGoogleConsentCode()
  }, [])

  const getGoogleConsentCode = async () => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code")

    if (code) {
      const userData = await getGoogleUser(code)
      handleUserSessionUpdate({ ...userSession, ...userData })
    }
  }

  const validateEmail = () => {
    const hasError = email === "" || !EMAIL_REGEX.test(email)
    setEmailHasError(hasError);
  };

  const validatePassword = () => {
    setPasswordHasError(password === "");
  };

  const handleLogIn = () => {
    if (email === '') {
      setEmailHasError(true)
    }
    if (password === '') {
      setPasswordHasError(true)
    }

    if (emailHasError || passwordHasError) {
      return
    }

    console.log("login")
  };

  return (
    <div className="loginForm">
      <span className="loginFormInput">
        <TextField
          id="userEMail"
          label="e-mail"
          variant="standard"
          error={emailHasError}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={validateEmail}
          onFocus={() => setEmailHasError(false)}
        />
        {emailHasError ? (
          <p className="loginFormInputError">
            {text.emailError}
          </p>
        ) : null}
      </span>
      <span className="loginFormInput">
        <TextField
          id="userPassword"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          error={passwordHasError}
          onBlur={validatePassword}
          onFocus={() => setPasswordHasError(false)}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordHasError ? (
          <p className="loginFormInputError">
            {text.passwordError}
          </p>
        ) : null}
      </span>
      <div className="loginFormButtonWrapper">
        <Button
          onClick={getGoogleConsentUrl}
          variant="outlined"
        >
          {text.logIn}
        </Button>
        <Button
          onClick={handleLogIn}
          variant="outlined"
          disabled={emailHasError || passwordHasError}
        >
          {text.logInWithG}
        </Button>
      </div>
    </div>
  );
}
