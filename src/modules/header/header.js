import React from "react";
import "./header.scss";
import Button from "@mui/material/Button";
import { defaultSession, SessionContext } from "../../Session";
import { text } from "../text"

export default function AppHeader() {
	return (
		<SessionContext.Consumer >
			{sessionContext => (
				<header className="header">
					<h2 variant="h5">My Cloud</h2>
					{sessionContext.userSession.access_token !== "" && (
						<Button onClick={() => sessionContext.handleUserSessionUpdate(defaultSession)} color="inherit">
							{text.logOut}
						</Button>
					)}
				</header>
			)}
		</SessionContext.Consumer >

	);
}
