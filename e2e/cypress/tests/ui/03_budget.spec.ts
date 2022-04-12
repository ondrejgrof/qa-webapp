
describe('Budget', () => {

    let budgets: Array<{ name: string }> = []
    let items: Array<{ name: string, category: string, amount: number }> = []
    let users: Array<{ name: string, password: string }> = []

    before(() => {
        cy.clearLocalStorage()
        cy.clearCookies()

        cy.fixture('budgets').then(_budgets => {
            budgets = _budgets.budgets || []
        })
        cy.fixture('items').then(_items => {
            items = _items.items || []
        })
        cy.fixture('users').then(_users => {
            users = _users.users || []
        })
    })

    beforeEach(() => {
        cy.task('users:create', users).then(usersData => {
            cy.setLocalStorage('users', usersData as string)
        })
        cy.logIn(users[0].name, users[0].password)
    })

    it('creates budget categories', () => {
        cy.getElByCySel('budgetCard').should('not.exist')
        budgets.forEach(budget => {
            cy.createBudgetCategory(budget.name)
        })
        cy.getElByCySel('budgetCard').each((budgetCard, index) => {
            cy.wrap(budgetCard).contains('h3', budgets[index].name).should('exist')
            cy.wrap(budgetCard).within(() => {
                cy.getElByCySel('budgetUser').should('have.length', 1)
            })
        })
        cy.getElByCySel('budgetCard').should('have.length', budgets.length)
    })

    it('deletes budget category', () => {
        cy.getElByCySel('budgetCard').should('not.exist')
        budgets.forEach(budget => {
            cy.createBudgetCategory(budget.name)
        })

        cy.getElByCySel('deleteCardButton').eq(0).click()

        cy.getElByCySel('budgetCard').should('have.length', budgets.length - 1)

        const validBudgets = budgets.slice(1)

        cy.getElByCySel('budgetCard').each((budgetCard, index) => {
            cy.wrap(budgetCard).contains('h3', validBudgets[index].name).should('exist')
        })
    })

    it('adds user to / deletes user from category', () => {
        cy.getElByCySel('budgetCard').should('not.exist')

        cy.createBudgetCategory(budgets[0].name)

        cy.getElByCySel('budgetCard').eq(0).within(() => {
            cy.getElByCySel('budgetUser').should('have.length', 1)
            cy.addUserToBudget(users[1].name)
            cy.getElByCySel('budgetUser').should('have.length', 2)
            cy.removeUserFromBudget(users[1].name)
            cy.getElByCySel('budgetUser').should('have.length', 1)
        })
    })

    it('adds/ delete entry to/from budget category', () => {
        cy.getElByCySel('budgetCard').should('not.exist')

        budgets.forEach(budget => {
            cy.createBudgetCategory(budget.name)
        })

        cy.getElByCySel('budgetCard').eq(0).click()
        cy.location('pathname').should('match', /\/lists\/.{8}/)
        cy.contains('h1', budgets[0].name)

        cy.getElByCySel('entryCard').should('not.exist')

        items.forEach(item => {
            cy.addEntryToBudget(item.name, item.category, item.amount)
        })

        cy.getElByCySel('entryCard').each((card, index) => {
            cy.wrap(card).within(() => {
                cy.getElByCySel('entryUser').should('have.length', 1)
                cy.getElByCySel('amount').invoke('text').then($text => {
                    const trimmedText = Number($text.replace(/\s+/g, ''))
                    expect(trimmedText).to.eq(items[index].amount)
                })
            })
        })
    })

    it('adds entry to budget category with multiple users', () => {
        cy.getElByCySel('budgetCard').should('not.exist')

        budgets.forEach(budget => {
            cy.createBudgetCategory(budget.name)
        })
        cy.getElByCySel('budgetCard').eq(0).within(() => {
            cy.addUserToBudget(users[1].name)
            cy.getElByCySel('budgetUser').should('have.length', 2)
        })
        cy.getElByCySel('budgetCard').eq(0).click()
        cy.location('pathname').should('match', /\/lists\/.{8}/)
        cy.contains('h1', budgets[0].name)

        cy.getElByCySel('entryCard').should('not.exist')

        items.forEach(item => {
            cy.addEntryToBudget(item.name, item.category, item.amount)
        })

        cy.getElByCySel('entryCard').eq(0).within(() => {
            cy.getElByCySel('entryUser').should('have.length', 2)
        })
    })

    context('Validation', () => {

        it('should not be able to create budget category with empty name', () => {
            cy.getElByCySel('newBudgetNameInput').clear()
            cy.getElByCySel('createBudgetBtn').should('be.disabled')
        })

        it('should not be able to create entry with empty name', () => {
            cy.createBudgetCategory('Test')
            cy.getElByCySel('budgetCard').eq(0).click()
            cy.getElByCySel('budgetItemNameInput').clear()
            cy.getElByCySel('budgetItemCreateBtn').should('be.disabled')
        })

        it('should not be able to create entry with empty category', () => {
            cy.createBudgetCategory('Test')
            cy.getElByCySel('budgetCard').eq(0).click()
            cy.getElByCySel('budgetItemNameInput').type('test')
            cy.getElByCySel('budgetItemCreateBtn').should('be.disabled')
        })

        it('should not be able to create entry with empty amount', () => {
            cy.createBudgetCategory('Test')
            cy.getElByCySel('budgetCard').eq(0).click()
            cy.getElByCySel('budgetItemNameInput').type('test')
            cy.getElByCySel('budgetItemNameInput').type('Other')
            cy.getElByCySel('budgetItemCreateBtn').should('be.disabled')
        })
    })
})

