/// <reference types="cypress" />

declare namespace Cypress {

    interface Chainable {
        /**
         * Custom command to signUp user
         * @param name Username
         * @param pw Password
         * @example cy.signUp('user1', 'password1')
         */
        signUp(
            name: string,
            pw: string
        ): Chainable<Element>

        /**
         * Custom command to signUp user by press enter
         * @param name Username
         * @param pw Password
         * @example cy.signUpByEnter('user1', 'password1')
         */
        signUpByEnter(
            name: string,
            pw: string
        ): Chainable<Element>

        /**
         * Custom command to logIn user into system
         * @param name Username
         * @param pw Password
         * @example cy.logIn('user1', 'password1')
         */
        logIn(
            name: string,
            pw: string
        ): Chainable<Element>

        /**
         * Custom command to logIn user into system by press enter
         * @param name Username
         * @param pw Password
         * @example cy.logInByEnter('user1', 'password1')
         */
        logInByEnter(
            name: string,
            pw: string
        ): Chainable<Element>


        /**
         * Custom command to create budget category
         * @param name Category name
         * @example cy.createBudgetCategory('Traveling')
         */
        createBudgetCategory(
            name: string,
        ): Chainable<Element>

        /**
         * Custom command to add user to budget
         * @param username user name of added user
         * @example cy.addUserToBudget('JohnDoe')
         */
        addUserToBudget(
            username: string,
        ): Chainable<Element>

        /**
         * Custom command to remove user from budget
         * @param username user name of removed user
         * @example cy.removeUserToBudget('JohnDoe')
         */
        removeUserFromBudget(
            username: string,
        ): Chainable<Element>

        /**
         * Custom command to add user to budget
         * @param name Name of entry
         * @param category Name of category
         * @param amount Amount of spent money
         * @example cy.addEntryToBudget('Pizza', 500)
         */
        addEntryToBudget(
            name: string,
            category: string,
            amount: number,
        ): Chainable<Element>

        /**
         * Custom command to check amount in string format with number
         * @param checkedValue Checked value
         * @example cy.checkAmount(121)
         */
        checkAmount(
            checkedValue: number,
        ): Chainable<Element>

        /**
         * Custom command to get Element by value of attribute of data-cy
         * @param value Value of HTML attribute data-cy
         * @param args Value of HTML attribute data-cy
         * @example cy.getElByCySel('loginBtn')
         */
        getElByCySel(
            value: string,
            ...args: any[]
        ): Chainable<Element>
    }
}

Cypress.Commands.add('signUp', (username: string, password: string) => {
    cy.visit('/signup')
    cy.get(`input[type='username']`).type(username)
    cy.get(`input[type='password']`).each(pwInput => cy.wrap(pwInput).type(password))
    cy.get(`button[data-cy=signUpBtn]`).click()
})

Cypress.Commands.add('signUpByEnter', (username: string, password: string) => {
    cy.visit('/signup')
    cy.get(`input[type='username']`).type(username)
    cy.get(`input[type='password']`).each(pwInput => cy.wrap(pwInput).type(`${password}{enter}`))
})

Cypress.Commands.add('logIn', (username: string, password: string) => {
    cy.visit('/login')
    cy.get(`input[type='username']`).type(password)
    cy.get(`input[type='password']`).type(password)
    cy.get('button[data-cy=loginBtn]').click()
})

Cypress.Commands.add('logInByEnter', (username: string, password: string) => {
    cy.visit('/login')
    cy.get(`input[type='username']`).type(password)
    cy.get(`input[type='password']`).type(`${password}{enter}`)
})

Cypress.Commands.add('createBudgetCategory', (name: string) => {
    cy.visit('/lists')
    cy.getElByCySel('newBudgetNameInput').type(name)
    cy.getElByCySel('createBudgetBtn').click()
})

Cypress.Commands.add('addUserToBudget', (username: string) => {
    cy.getElByCySel('cardUserSelect').select(username)
})

Cypress.Commands.add('removeUserFromBudget', (username: string) => {
    cy.getElByCySel('budgetUser').filter(`:contains(${username})`).click()
})

Cypress.Commands.add('addEntryToBudget', (name: string, category: string, amount: number) => {
    cy.getElByCySel('budgetItemNameInput').type(name)
    cy.getElByCySel('budgetItemCategorySelect').select(category)

    cy.getElByCySel('toggle').invoke('attr', 'mode').then( $mode => {
        if(($mode == 1 && amount > 0) || ($mode == 0 && amount < 0)){
            cy.getElByCySel('toggle').click()
        }
    })
    cy.getElByCySel('budgetItemAmountInput').type(Math.abs(amount).toString())
    cy.getElByCySel('budgetItemCreateBtn').click()
})

Cypress.Commands.add('checkAmount', { prevSubject: 'element' }, ($element: JQuery<HTMLElement>, checkValue: number) => {
    cy.wrap($element).invoke('text').then($text => {
        const trimmedText = Number($text.replace(/\s+/g, ''))
        expect(trimmedText).to.eq(checkValue)
    })
})

Cypress.Commands.add('getElByCySel', (value: string) => {
   cy.get(`[data-cy=${value}]`)
})