import { rename } from 'fs'

describe('Statistic', () => {

    let budgetsWithEntries: Array<{name: string, entries: Array<{ name: string, category: string, amount: number }>}> = []
    let users: Array<{ name: string, password: string }> = []

    before(() => {
        cy.clearLocalStorage()
        cy.clearCookies()

        cy.fixture('statistics').then(_budgets => {
            budgetsWithEntries = _budgets.budgets || []
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

    it('checks sums of entries', () => {
        budgetsWithEntries.forEach((budget, index) => {
            cy.createBudgetCategory(budget.name)
            cy.getElByCySel('budgetCard').eq(index).click()
            cy.contains('h1', budget.name)
            budget.entries.forEach(entry =>{
                cy.addEntryToBudget(entry.name, entry.category, entry.amount)
            })
            cy.getElByCySel('budgetDetailGoBackBtn').click()
        })

        cy.visit('/stats')

        const sumIncomeEntries = budgetsWithEntries.map(budget => {
            return budget.entries.filter(entry => entry.amount > 0).reduce( (prev, curr)  => prev + curr.amount, 0)
        }).reduce((prev, curr) => prev + curr, 0)

        const sumOutcomeEntries = budgetsWithEntries.map(budget => {
            return budget.entries.filter(entry => entry.amount < 0).reduce( (prev, curr)  => prev + curr.amount, 0)
        }).reduce((prev, curr) => prev + curr, 0)

        cy.getElByCySel('amount').eq(0).checkAmount(sumIncomeEntries)

        cy.getElByCySel('amount').eq(1).checkAmount(sumOutcomeEntries)

        budgetsWithEntries.forEach((budget, index) => {
            cy.getElByCySel('budgetStatsSelect').select(budget.name)

            const sumIncome = budget.entries.filter(entry => entry.amount > 0).reduce( (prev, curr)  => prev + curr.amount, 0)
            const sumOutcome = budget.entries.filter(entry => entry.amount < 0).reduce( (prev, curr)  => prev + curr.amount, 0)

            cy.getElByCySel('amount').eq(0).checkAmount(sumIncome)
            cy.getElByCySel('amount').eq(1).checkAmount(sumOutcome)
        })

    })
})