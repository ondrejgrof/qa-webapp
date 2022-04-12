import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { AuthContext } from "./helpers/auth-context";
import AuthRoute from "./helpers/auth-route";
import useLocalStorage from "./helpers/use-local-storage";

import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import ListsPage from "./pages/lists-page";
import ListItemsPage from "./pages/list-items-page";
import StatsPage from "./pages/stats-page";

import GlobalStyle from "./components/global-style";
import * as Nav from "./components/navigation/navigation";
import * as User from "./components/user/user";
import { LogOutButton } from "./components/button/button";

import { UserType } from "./types/types";

function App() {
  const [authTokens, setAuthTokens] = useLocalStorage<UserType | false>(
    "authTokens",
    false
  );

  return (
    <React.Fragment>
      <AuthContext.Provider value={{ authTokens, setAuthTokens }}>
        <Router>
          {authTokens && (
            <Nav.Navigation>
              <Nav.Item to="/lists">Budgets</Nav.Item>
              <Nav.Item to="/stats">Statistics</Nav.Item>
              <Nav.Auth>
                <User.Group>
                  <User.User username={authTokens.username} isLoggedUser />
                </User.Group>
                <LogOutButton onClick={() => setAuthTokens(false)} data-cy={'logOutBtn'}>
                  Log Out
                </LogOutButton>
              </Nav.Auth>
            </Nav.Navigation>
          )}

          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <AuthRoute exact path="/lists" component={ListsPage} />
            <AuthRoute path="/lists/:id" component={ListItemsPage} />
            <AuthRoute path="/stats" component={StatsPage} />
            <Redirect exact from="/" to="/lists" />
          </Switch>
        </Router>
      </AuthContext.Provider>
      <GlobalStyle />
    </React.Fragment>
  );
}

export default App;
