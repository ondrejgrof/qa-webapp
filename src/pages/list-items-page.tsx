import React, { useState } from "react";
import { withRouter, useParams, RouteComponentProps } from "react-router-dom";
import nanoid from "nanoid";

import useAuth from "../helpers/auth-context";
import useLocalStorage from "../helpers/use-local-storage";

import * as Title from "../components/title/title";
import * as Card from "../components/card/card";
import * as Form from "../components/form/form";
import * as User from "../components/user/user";
import Amount from "../components/amount/amount";
import Button, {
  BackButton,
  ToggleButton,
  ButtonIconType,
  ToggleModeType,
} from "../components/button/button";

import { UserType, ListType, ItemType, CategoryType } from "../types/types";

const isPositiveNumber = (str: string) =>
  !isNaN(str as any) &&
  !isNaN(parseFloat(str)) &&
  isFinite(str as any) &&
  parseFloat(str) > 0;

const ListItemsPage = ({ history }: RouteComponentProps<any>) => {
  const params = useParams<{ id: string }>();

  const { authTokens } = useAuth();
  const [lists, setLists] = useLocalStorage<ListType[]>("lists", []);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState(1);
  const [category, setCategory] = useState<CategoryType | "">("");

  const list = lists.find((list) => list.id === params.id);
  if (list === undefined) throw new Error(`List (id: ${params.id}) not found.`);

  const createItem = () => {
    const item: ItemType = {
      id: nanoid(8),
      user: authTokens as UserType,
      title,
      amount: direction * Math.abs(parseFloat(amount)),
      category: category as CategoryType,
    };
    list.items.push(item);
    setLists([...lists]);
    setTitle("");
    setAmount("");
    setCategory("");
  };

  const deleteItem = (id: string) => {
    const itemIndex = list.items.findIndex((item) => item.id === id);
    if (
      itemIndex >= 0 &&
      authTokens &&
      list.items[itemIndex].user.id === authTokens.id
    ) {
      list.items.splice(itemIndex, 1);
      setLists([...lists]);
    }
  };

  return (
    <main>
      <Title.PageTitle>
        <BackButton onClick={() => history.goBack()} data-cy={'budgetDetailGoBackBtn'}/>
        {list.title}
      </Title.PageTitle>
      {list.items.map((item) => {
        const isCurrentUser = !!(authTokens && item.user.id === authTokens.id);
        return (
          <Card.Card key={item.id} data-cy={'entryCard'}>
            <Card.Section>
              <Title.CardTitle>{item.title}</Title.CardTitle>
              <Title.CardSubTitle>
                {CategoryType[item.category as keyof typeof CategoryType]}
              </Title.CardSubTitle>
              <User.Group>
                <User.User
                    data-cy={"entryUser"}
                  username={isCurrentUser ? "You" : item.user.username}
                  isCurrentUser={isCurrentUser}
                />
              </User.Group>
            </Card.Section>
            <Card.Section>
              <Amount value={item.amount} data-cy={'entryAmount'}/>
              <Button
                icon={ButtonIconType.Delete}
                onClick={() => deleteItem(item.id)}
                disabled={!(authTokens && item.user.id === authTokens.id)}
              />
            </Card.Section>
          </Card.Card>
        );
      })}
      <Title.SectionTitle>Add Entry</Title.SectionTitle>
      <Card.Card>
        <Card.Section>
          <Form.TextInput
            value={title}
            label="Entry Name"
            data-cy="budgetItemNameInput"
            onChange={(event) => setTitle(event.target.value)}
            width="216px"
          />
          <Form.Select
            label="Select Category"
            data-cy="budgetItemCategorySelect"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as CategoryType)
            }
            width="216px"
          >
            {Object.keys(CategoryType).map((category) => (
              <option key={category} value={category}>
                {CategoryType[category as keyof typeof CategoryType]}
              </option>
            ))}
          </Form.Select>
        </Card.Section>
        <Card.Section>
          <ToggleButton
            mode={
              direction > 0 ? ToggleModeType.Income : ToggleModeType.Expense
            }
            onClick={() => setDirection(direction * -1)}
          />
          <Form.TextInput
            value={amount}
            label="Amount"
            data-cy="budgetItemAmountInput"
            onChange={(event) => setAmount(event.target.value)}
            width="112px"
          />
          <Button
            icon={ButtonIconType.Create}
            data-cy="budgetItemCreateBtn"
            disabled={
              !(title.length && category !== "" && isPositiveNumber(amount))
            }
            onClick={createItem}
          />
        </Card.Section>
      </Card.Card>
    </main>
  );
};

export default withRouter(ListItemsPage);
