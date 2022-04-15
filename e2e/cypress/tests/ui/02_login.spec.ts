describe('LoginModule', () => {

    let users: Array<{ name: string, password: string }>

    before(() => {
        cy.fixture('users').then(_users => {
            users = _users.users || []
        })
    })

    beforeEach(() => {
        cy.task('users:create', users).then( usersData => {
            cy.setLocalStorage('users', usersData as string)
        })
        cy.visit('/login')
    })

    it('does LogIn', () => {
        cy.logIn(users[0].name, users[0].password)
        cy.location('pathname').should('eq', '/lists')
        cy.getLocalStorage('authTokens').should('not.eq', 'false')
    })

    it('does LogIn by enter', () => {
        cy.logInByEnter(users[0].name, users[0].password)
        cy.location('pathname').should('eq', '/lists')
        cy.getLocalStorage('authTokens').should('not.eq', 'false')
    })

    it('does not LogIn not existing user', () => {
        cy.logIn('NotExist', 'NotExist')
        cy.location('pathname').should('eq', '/login')
        cy.getLocalStorage('authTokens').should('eq', 'false')
        cy.contains('div', 'Invalid username or password')
    })

    it('does logout', () => {
        cy.logIn(users[0].name, users[0].password)
        cy.location('pathname').should('eq', '/lists')

        cy.getElByCySel('logOutBtn').click()

        cy.getLocalStorage('authTokens').should('eq', 'false')
        cy.location('pathname').should('eq', '/login')

    })

    it("redirects the unauthenticated user to the login page",  () => {
        cy.visit("/lists")
        cy.location("pathname").should("equal", "/login")
    })

    it('does not allow redirecting the authenticated user to the login page', () => {
        cy.logIn(users[0].name, users[0].password)
        cy.visit('/login')
        cy.location('pathname').should('eq', '/lists')
    })

    it('redirects to the signup page', () => {

        cy.contains('a', 'Sign Up').click()
        cy.location('pathname').should('eq', '/signup')
    })

    context('Validation', () => {

        beforeEach(() => {
            cy.visit('/login')
        })

        it('should not be able to click Log In with empty inputs', () => {
            cy.getElByCySel('loginBtn').should('be.disabled')
        })

        it('should not be able to click Log In with an empty UserName', () => {
            cy.get('input[type=\'password\']').type('test')
            cy.getElByCySel('loginBtn').should('be.disabled')
        })

        it('should not be able to click Log In with an empty Password', () => {
            cy.get('input[type=\'username\']').type('test')
            cy.getElByCySel('loginBtn').should('be.disabled')
        })
    })

})