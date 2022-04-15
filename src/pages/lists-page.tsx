import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import nanoid from "nanoid";

import useAuth from "../helpers/auth-context";
import useLocalStorage from "../helpers/use-local-storage";

import * as Title from "../components/title/title";
import * as Card from "../components/card/card";
import * as Form from "../components/form/form";
import * as User from "../components/user/user";
import Button, { ButtonIconType } from "../components/button/button";

import { UserType, ListType } from "../types/types";

const availableUsers = (allUsers: UserType[], listUsers: UserType[]) =>
  allUsers.filter(
    (allUser) =>
      !listUsers.some((listUser: UserType) => listUser.id === allUser.id)
  );

const ListsPage = () => {
  const match = useRouteMatch();

  const { authTokens } = useAuth();
  const [users] = useLocalStorage<UserType[]>("users", []);
  const [lists, setLists] = useLocalStorage<ListType[]>("lists", []);
  const [title, setTitle] = useState("");

  const createList = () => {
    const list: ListType = {
      id: nanoid(8),
      title,
      users: [authTokens as UserType],
      items: [],
    };
    setLists([...lists, list]);
    setTitle("");
  };

  const deleteList = (id: string) => {
    setLists(lists.filter((list) => id !== list.id));
  };

  const addUserToList = (listId: string, userId: string) => {
    const list = lists.find((list: ListType) => list.id === listId);
    const user = users.find((user: UserType) => user.id === userId);
    if (list === undefined) throw new Error(`List (id: ${listId}) not found.`);
    if (user === undefined) throw new Error(`User (id: ${userId}) not found.`);

    list.users.push(user);
    setLists([...lists]);
  };

  const deleteUserFromList = (listId: string, userId: string) => {
    const list = lists.find((list) => list.id === listId);
    if (list === undefined) throw new Error(`List (id: ${listId}) not found.`);

    const userIndex = list.users.findIndex(
      (user: UserType) => user.id === userId
    );
    if (
      userIndex >= 0 &&
      authTokens &&
      list.users[userIndex].id !== authTokens.id
    ) {
      list.users.splice(userIndex, 1);
      setLists([...lists]);
    }
  };

  const availableLists = lists.filter((list) =>
    list.users.some((user) => authTokens && user.id === authTokens.id)
  );

  return (
    <main>
      <Title.PageTitle>My Budgets</Title.PageTitle>
      {availableLists.map((list) => (
        <Card.Card key={list.id} linkTo={`${match.url}/${list.id}`} data-cy={'budgetCard'}>
          <Card.Section>
            <Title.CardTitle>{list.title}</Title.CardTitle>
            <User.Group>
              {list.users.map((user) => {
                const isCurrentUser = !!(
                  authTokens && user.id === authTokens.id
                );
                return (
                  <User.User
                    key={user.id}
                    username={isCurrentUser ? "You" : user.username}
                    isCurrentUser={isCurrentUser}
                    onClick={
                      isCurrentUser
                        ? undefined
                        : () => deleteUserFromList(list.id, user.id)
                    }
                    data-cy={'budgetUser'}
                  />
                );
              })}
            </User.Group>
          </Card.Section>
          <Card.Section>
            <Form.Select
              label="Add User"
              value=""
              onChange={(event) => {
                addUserToList(list.id, event.target.value);
                event.target.blur();
              }}
              width="128px"
              data-cy={'cardUserSelect'}
            >
              {availableUsers(users, list.users).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
            <Button
              icon={ButtonIconType.Delete}
              onClick={() => deleteList(list.id)}
              data-cy={'deleteCardButton'}
            />
          </Card.Section>
        </Card.Card>
      ))}
      <Title.SectionTitle>Add Budget</Title.SectionTitle>
      <Card.Card>
        <Card.Section>
          <Form.TextInput
            value={title}
            label="Budget Name"
            data-cy={'newBudgetNameInput'}
            onChange={(event) => setTitle(event.target.value)}
            width="256px"
          />
        </Card.Section>
        <Card.Section>
          <Button
            icon={ButtonIconType.Create}
            data-cy={'createBudgetBtn'}
            disabled={!title.length}
            onClick={createList}
          />
        </Card.Section>
      </Card.Card>
    </main>
  );
};

export default ListsPage;
