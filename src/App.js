import React from "react"
import "./App.scss";

import AppHeader from "./modules/header/header";
import LoginForm from "./modules/loginForm/loginForm";
import BucketList from "./modules/buckets/bucketList";
import { UserSession, SessionContext } from "./Session";

export default function App() {
  return (
    <div className="MyCloud">
      <UserSession>
        <AppHeader />
        <SessionContext.Consumer>
          {sessionContext => (sessionContext.userSession.access_token === "" ? <LoginForm /> : <BucketList />)}
        </SessionContext.Consumer>
      </UserSession>
    </div>
  );
}
