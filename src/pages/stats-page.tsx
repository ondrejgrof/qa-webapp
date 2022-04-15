import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
} from "recharts";

import useAuth from "../helpers/auth-context";
import useLocalStorage from "../helpers/use-local-storage";

import { colors } from "../components/global-style";
import * as Title from "../components/title/title";
import * as Card from "../components/card/card";
import * as Form from "../components/form/form";
import * as Chart from "../components/chart/chart";
import Amount from "../components/amount/amount";

import { UserType, ListType, CategoryType } from "../types/types";

const getDistinctUsers = (users: UserType[]): UserType[] => {
  const result: UserType[] = [];
  const set = new Set();
  users.forEach((user) => {
    if (!set.has(user.id)) {
      set.add(user.id);
      result.push(user);
    }
  });
  return result;
};

const graphMargin = 16;
const graphMargins = {
  top: graphMargin,
  right: graphMargin,
  bottom: graphMargin,
  left: graphMargin,
};

const graphColors = {
  [CategoryType.Home]: colors.graph1,
  [CategoryType.Health]: colors.graph2,
  [CategoryType.Food]: colors.graph3,
  [CategoryType.Transport]: colors.graph4,
  [CategoryType.Entertainment]: colors.graph5,
  [CategoryType.Other]: colors.graph6,
};

const StatsPage = () => {
  const { authTokens } = useAuth();
  const [lists] = useLocalStorage<ListType[]>("lists", []);

  const [list, setList] = useState("");
  const [user, setUser] = useState("");

  const availableLists = lists.filter((list) =>
    list.users.some((user) => authTokens && user.id === authTokens.id)
  );
  const selectedList = list
    ? availableLists.find((aList) => aList.id === list)
    : undefined;
  const availableUsers = selectedList
    ? selectedList.users
    : getDistinctUsers(availableLists.map((list) => list.users).flat());
  const selectedUser = user
    ? availableUsers.find((aUser) => aUser.id === user)
    : undefined;
  const availableListItems = (selectedList
    ? selectedList.items
    : availableLists.map((list) => list.items).flat()
  ).filter((item) => (selectedUser ? item.user.id === selectedUser.id : true));

  const incomesMap: Partial<any> = {}; //FIXME type Partial<{ [key in CategoryType]: number }>
  const expensesMap: Partial<any> = {};
  availableListItems.forEach((item) => {
    const entryMap = item.amount < 0 ? expensesMap : incomesMap;
    if (entryMap[item.category])
      entryMap[item.category] = entryMap[item.category] + Math.abs(item.amount);
    else entryMap[item.category] = Math.abs(item.amount);
  });
  const incomes = Object.keys(incomesMap).map((key) => ({
    category: key,
    value: incomesMap[key],
  }));
  const expenses = Object.keys(expensesMap).map((key) => ({
    category: key,
    value: expensesMap[key],
  }));

  return (
    <main>
      <Title.PageTitle>Statistics</Title.PageTitle>
      <Card.Card>
        <Card.Section fullWidth>
          <Form.Select
            label="Filter by List"
            value={list}
            data-cy={"budgetStatsSelect"}
            onChange={(event) => setList(event.target.value)}
            width="160px"
          >
            {availableLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            label="Filter by User"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            width="160px"
          >
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Form.Select>
        </Card.Section>
        <Card.Section>
          <Title.CardSubTitle style={{ marginRight: "-8px" }}>
            Total Income:
          </Title.CardSubTitle>
          <Amount
            value={incomes
              .map((income) => income.value)
              .reduce((a, b) => a + b, 0)}
          />
          <Title.CardSubTitle style={{ marginRight: "-8px" }}>
            Total Expense:
          </Title.CardSubTitle>
          <Amount
            value={
              expenses
                .map((expense) => expense.value)
                .reduce((a, b) => a + b, 0) * -1
            }
          />
        </Card.Section>
      </Card.Card>
      <Card.Card>
        <Card.Section fullWidth>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={availableListItems} margin={graphMargins}>
              <CartesianGrid strokeDasharray="1 5" stroke={colors.inputLine} />
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke={colors.inputLine} />
              <Bar dataKey="amount">
                {availableListItems.map((item) => (
                  <Cell
                    key={item.id}
                    fill={
                      graphColors[
                        CategoryType[item.category as keyof typeof CategoryType]
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Section>
        <Card.Section
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <PieChart width={240} height={360}>
            <Pie
              data={incomes}
              dataKey="value"
              cx={120}
              cy={100}
              innerRadius={24}
              outerRadius={48}
              paddingAngle={4}
              label
            >
              {incomes.map((item) => (
                <Cell
                  key={item.category}
                  fill={
                    graphColors[
                      CategoryType[item.category as keyof typeof CategoryType]
                    ]
                  }
                />
              ))}
            </Pie>
            <Pie
              data={expenses}
              dataKey="value"
              cx={120}
              cy={260}
              innerRadius={24}
              outerRadius={48}
              paddingAngle={4}
              label
            >
              {expenses.map((item) => (
                <Cell
                  key={item.category}
                  fill={
                    graphColors[
                      CategoryType[item.category as keyof typeof CategoryType]
                    ]
                  }
                />
              ))}
            </Pie>
          </PieChart>
          <Chart.Sign sign={Chart.SignType.Income} top={98} left={112} />
          <Chart.Sign sign={Chart.SignType.Expense} top={259} left={116} />
        </Card.Section>
      </Card.Card>
      <Card.Card>
        <Card.Section fullWidth>
          <Chart.Legend>
            {Object.keys(CategoryType).map((category) => {
              const categoryName =
                CategoryType[category as keyof typeof CategoryType];
              return (
                <Chart.LegendItem
                  key={categoryName}
                  color={graphColors[categoryName]}
                >
                  {categoryName}
                </Chart.LegendItem>
              );
            })}
          </Chart.Legend>
        </Card.Section>
      </Card.Card>
    </main>
  );
};

export default StatsPage;
