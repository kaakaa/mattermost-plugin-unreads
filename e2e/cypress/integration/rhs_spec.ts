import {plugin} from '../utils/plugins';

const baseURL = Cypress.config('baseUrl');

describe('RHS', () => {
    let testTeam: string;
    before(() => {
        const newSettings = {
            PluginSettings: {
                Enable: true,
            },
            ServiceSettings: {
                EnableTesting: true,
                EnableDeveloper: true,
            },
        };

        cy.apiUpdateConfig(newSettings);
        cy.apiInitSetup().then(({team}) => {
            testTeam = team;
        })
        cy.apiUploadAndEnablePlugin(plugin);
    });

    it('toggle by header icon', () => {
        cy.visit(`/${testTeam.name}/channels/town-square`);

        const headerIcon = cy.get('button.channel-header__icon > i.icon__plugin-unreads');

        headerIcon.click();

        cy.get('#rhsContainer').should('be.visible');
        cy.get('.sidebar--right__title').should('have.text', 'Unreads');
    });
})
