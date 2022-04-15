/// <reference types="cypress-localstorage-commands" />

describe('SignUp', () => {

    let users: Array<{ name: string, password: string }>

    before(() => {
        cy.fixture('users').then(_users => {
            users = _users.users || []
        })
    })

    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.visit('/signup')
    })

    it('does signup new user', () => {
        cy.signUp(users[0].name, users[0].password)
        cy.location('pathname').should('eq', '/login')
        cy.getLocalStorage('users').then(($value) => {
            let usersData = JSON.parse($value)
            expect(usersData).to.length(1)
        })

        cy.logIn(users[0].name, users[0].password)
        cy.url().should('contain', '/lists')
        cy.getLocalStorage('authToken').should('not.eq', 'false')
    })

    it('does signup new user by enter', () => {
        cy.signUpByEnter(users[0].name, users[0].password)
        cy.location('pathname').should('eq', '/login')
        cy.getLocalStorage('users').then(($value) => {
            let usersData = JSON.parse($value)
            expect(usersData).to.length(1)
        })

        cy.logIn(users[0].name, users[0].password)
        cy.url().should('contain', '/lists')
        cy.getLocalStorage('authToken').should('not.eq', 'false')
    })

    it('does not signup the same user twice', () => {
        cy.signUp(users[0].name, users[0].password)

        cy.visit('/signup')

        cy.signUp(users[0].name, `${users[0].password}00`)

        cy.getLocalStorage('users').then(($value) => {
            let usersData = JSON.parse($value)
            expect(usersData).to.length(1)
        })

        cy.location('pathname').should('eq', '/signup')
        cy.contains('div', 'Username is already taken.').should('exist')

        cy.visit('/login')
        cy.logIn(users[0].name, users[0].password)
        cy.url().should('contain', '/lists')
    })

    context('Validation', () => {

        it('should not be able to click SignUp with empty inputs', () => {
            cy.getElByCySel('signUpBtn').should('be.disabled')
        })

        it('should not be able to click Sign Up with empty UserName', () => {
            cy.get('input[type=\'password\']').each(pwInput => cy.wrap(pwInput).type('test'))
            cy.getElByCySel('signUpBtn').should('be.disabled')
        })

        it('should not be able to click Sign Up with empty Password', () => {
            cy.get('input[type=\'username\']').type('test')
            cy.getElByCySel('signUpBtn').should('be.disabled')
        })

        it('should not be able to click Sign Up with empty Password (second input)', () => {
            cy.get('input[type=\'username\']').type('test')
            cy.get('input[type=\'password\']').eq(0).type('test')
            cy.getElByCySel('signUpBtn').should('be.disabled')
        })

        it('should not be able to click Sign Up with different passwords', () => {
            cy.get('input[type=\'username\']').type('test')
            cy.get('input[type=\'password\']').each((pwInput, index) => {
                cy.wrap(pwInput).type(`test${index}`)
            })
            cy.getElByCySel('signUpBtn').should('be.disabled')
        })
    })

})