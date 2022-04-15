import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import nanoid from "nanoid";
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

function SignupPage() {
  const { authTokens } = useAuth();
  const [users, setUsers] = useLocalStorage<UserType[]>("users", []);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTest, setPasswordTest] = useState("");

  const [isRegistred, setIsRegistred] = useState(!!authTokens);
  const [isDuplicate, setIsDuplicate] = useState(false);

  function signup() {
    const testDuplicate = users.some(
      (user: UserType) => user.username === username
    );
    setIsDuplicate(testDuplicate);
    if (testDuplicate) return;

    const saltRounds = 8;
    const user = {
      id: nanoid(8),
      username,
      hashedPassword: bcrypt.hashSync(password, saltRounds),
    };
    setUsers([...users, user]);
    setIsRegistred(true);
  }

  if (isRegistred) {
    return <Redirect to="/login" />;
  }

  return (
    <Main>
      <Title.PageTitle>Sign Up</Title.PageTitle>
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
          <Form.TextInput
            type="password"
            value={passwordTest}
            label="Password (Repeat)"
            onChange={(event) => setPasswordTest(event.target.value)}
            width="100%"
          />
        </Card.FormItem>
        <Card.FormItem>
          {isDuplicate ? (
            <Message type={MessageType.Error}>
              Username is already taken.
            </Message>
          ) : (
            <span />
          )}
          <Button
            disabled={
              !(username.length && password.length && password === passwordTest)
            }
            onClick={signup}
            data-cy={'signUpBtn'}
          >
            Sign Up
          </Button>
        </Card.FormItem>
      </Card.Card>
      <Message style={{ marginTop: "12px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Log In</Link>
      </Message>
    </Main>
  );
}

export default SignupPage;
