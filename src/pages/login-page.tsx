import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import bcrypt from "bcryptjs";

import useAuth from "../helpers/auth-context";
import useLocalStorage from "../helpers/use-local-storage";

import * as Title from "../components/title/title";
import * as Card from "../components/card/card";
import * as Form from "../components/form/form";
import Button from "../components/button/button";
import Message, { MessageType } from "../components/message/message";

import { UserType } from "../types/types";

const Main = styled.main`
  max-width: 560px;
  margin-top: 80px;
`;

function LoginPage() {
  const { authTokens, setAuthTokens } = useAuth();
  const [users] = useLocalStorage("users", []);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setLoggedIn] = useState(!!authTokens);
  const [isInvalid, setIsInvalid] = useState(false);

  function login() {
    const user = users.find(
      (user: UserType) =>
        user.username === username &&
        bcrypt.compareSync(password, user.hashedPassword)
    );
    setIsInvalid(!user);
    if (!user) return;

    if (setAuthTokens) {
      setAuthTokens(user);
      setLoggedIn(true);
    }
  }

  if (isLoggedIn) {
    return <Redirect to="/lists" />;
  }

  return (
    <Main>
      <Title.PageTitle>Log In</Title.PageTitle>
      <Card.Card>
        <Card.FormItem>
          <Form.TextInput
            type="username"
            value={username}
            label="Username"
            onChange={(event) => setUserName(event.target.value)}
            width="100%"
          />
        </Card.FormItem>
        <Card.FormItem>
          <Form.TextInput
            type="password"
            value={password}
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            width="100%"
          />
        </Card.FormItem>
        <Card.FormItem>
          {isInvalid ? (
            <Message type={MessageType.Error}>
              Invalid username or password.
            </Message>
          ) : (
            <span />
          )}
          <Button
            disabled={!username.length || !password.length}
            onClick={login}
            data-cy={'loginBtn'}
          >
            Log In
          </Button>
        </Card.FormItem>
      </Card.Card>
      <Message style={{ marginTop: "12px", textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Message>
    </Main>
  );
}

export default LoginPage;
