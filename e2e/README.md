# SOLUTION DESCRIPTION

## Approach
In the beginning, I tried to understand the application itself, the code, and the workflows. The observation was that the app stores all data in localStorage, which makes API testing impossible. So I decided to code only UI tests written in the Cypress framework.

I prepared four testing files, each covering one app component. (SingUp, Logging, Budgets, Statistics). The reason to separate tests into these files is the possibility of executing only the one or few tests suites covering the changed components in the PR request, for example. Not necessary now, but very useful in the future.

Although it would be great to use a data mockup, I decided not to use it because the app doesn't export functions for data preparation, and if I hardcode the data in the required format, it will create a problem with the test maintenance in the future. All data is prepared during the test case through Web UI.

**I changed some parts of the code in the app. These changes support the ability to make automated tests more stable. These changes also simulate the communication and collaboration between Dev and QA departments.**

Code of app and tests are in one repo, but the used structure allows storing tests in a separate repo.
## Tech stack
Description of used technology in this task
### Cypress
The tested application is web-based, so Cypress was one of the first choices which came into my mind.
The reasons why I chose Cypress are
- The modern tool for web-based testing
- Open-source
- Great community
- Great documentation
- Features like test recording, screenshots, time-traveling, etc...

I think the detailed description of this framework is not part of this task. Check [documentation](https://docs.cypress.io) if you are interested in the framework.

### Typescript
Cypress supports only Typescript and Javascript. The tested app is written in typescript, so we should also code tests in typescript. We should also use typescript instead of javascript because of the type checking and more readable code.

### Docker
One of the requirements was to dockerized tests, so using the docker technology was essential to meet this request :)
##Tests
### Test structure
All tests you will find in the path `./cypres/*` with the following structure
```
cypress
|   tsconfig.json
└───fixtures    (Test data)
└───plugins     (Tasks for cypress)
└───support     (Commands for cypress)
└───tests       (Tests)
```
### Test cases
#### Sign Up
- Sign Up for new user
- Sign Up for new user by pressing Enter
- Signup the same user twice
- Validation
#### Log In
- Log In user
- Log In user by pressing Enter
- Do not Log In not existing user
- Log Out
- Redirect unauthenticated users to the login page
- Do not allow redirecting an authenticated user to the login page
- Redirect to the signup page
- Validation

#### Budgets
- Create budget categories
- Deletes budget category
- Add user to / delete user from category
- Add/ delete entry to/from budget category
- Add an entry to the budget category with multiple users
- Validation

#### Statistics
- Check sums of entries

### Bugs

| ID  | Summary                                     | Component     | Steps to reproduce                                                                                                                                                                                                                                                | Severity |
|-----|---------------------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| 1   | Not possible to assign a user to entries in budget detail| Budget Detail | 1. Create two users<br/>2. Log In with one of the accounts<br/>3. Go to the budget page (`/lists`)<br/> 4. Create a budget<br/>5. Add another user for created budget<br/> 6. Go to the budget detail<br/>7.Create entry<br/>8. Not possible to choose added user | P1       |
| 2   | Sign Up doesn't work on Enter press         | Sign Up       | 1. Go to the Sign Up page (`/signup`)<br/>2. Type text to inputs<br/>3. Put the focus on one of the inputs<br/>4. Press Enter<br/>5. Nothing happened                                                                                                             | P3       |
| 3   | Log In doesn't work on Enter press          | Log In        | 1. Go to the Sign Up page (`/login`)<br/>2. Type text to inputs<br/>3. Put the focus on one of the inputs<br/>4. Press Enter<br/>5. Nothing happened                                                                                                              | P3       |


*Priority level (1 - critical, 2 - major, 3 - minor)


##How to run tests
### Script
```
./run_test.sh
```

### Docker
1. Build services via docker-compose (`./e2e/docker-compose.yml`)
```
docker-compose build
```
2. Start services
```
docker-compose up
```

### Localhost (Without docker)
1. Install dependencies (Application and test dependencies)
```
npm install
```
2. Start the application
```
npm run start
```
2. Add the `baseUrl` attribute into the config file `./e2e/cypress.json` with an address to the app (Example `http://localhost:3000`)
```
{
...
baseUrl: "http://localhost:3000/"
...
}
```
3. Run cypress tests
```
npm cypress open
```
