// cypress/plugins/index.ts
/// <reference types="cypress" />


let nanoid = require('nanoid')
let bcrypt = require('bcryptjs')


/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    on('task', {
        'users:create': (usersData: Array<any>) => {
            const hashedUsers = usersData.map(user => {
                return {
                    id: nanoid(8),
                    username: user.name,
                    hashedPassword: bcrypt.hashSync(user.password, 8),
                }
            })
            return JSON.stringify(hashedUsers)
        }
    })
}