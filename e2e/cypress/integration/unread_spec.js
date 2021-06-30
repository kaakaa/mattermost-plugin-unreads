import {plugin} from '../utils/plugins';

describe('subscribe unreads post', () => {
    let testTeam, testChannel, testUser;
    before(() => {
        cy.apiInitSetup().then(({team, channel, user}) => {
            testTeam = team;
            testChannel = channel;
            testUser = user;
        })
    });

    beforeEach(() => {
        cy.apiAdminLogin();
        cy.visit(`/${testTeam.name}/channels/town-square`);
        cy.get('#postListContent').should('be.visible');
        cy.get('.row.main i.icon__plugin-unreads').should('be.visible').and('exist').click();
    });

    it('show an unread message', () => {
        const message = '1: test message';
        cy.postMessageAs({sender: testUser, message: message, channelId: testChannel.id})
            .then(({id}) => {
                cy.get(`.plugin-unreads-channel__${testChannel.id}`).should('have.length', 1);
                cy.get(`.plugin-unreads-post__${id} .plugin-unreads-post__content p`).should('have.text', message);
            });
    });

    it('show unread messages in two channels', () => {
        const message = '2: test message';
        cy.apiGetChannelByName(testTeam.name, 'off-topic').then(({channel: offTopicChannel}) => {
            cy.postMessageAs({sender: testUser, message: message, channelId: offTopicChannel.id}).then(({id}) => {
                cy.get(`.plugin-unreads-channel__${offTopicChannel.id}`).should('have.length', 1);
                cy.get(`.plugin-unreads-post__${id} .plugin-unreads-post__content p`).should('have.text', message);
            });
        });
    });

    it('add an unread message in existing channel', () => {
        const message = '3: test message';
        cy.postMessageAs({sender: testUser, message: message, channelId: testChannel.id})
            .then(({id}) => {
                cy.get(`.plugin-unreads-post__${id} .plugin-unreads-post__content p`).should('have.text', message);
            });
    })

    it('mark as read', () => {
        cy.get('.plugin-unreads-channel').should('have.length', 2);
        cy.get('.plugin-unreads-post').should('have.length', 3);

        cy.get(`.plugin-unreads-channel__${testChannel.id}`).within(() => {
            cy.get('.plugin-unreads-channel__header-icon').click();
        });

        cy.get('.plugin-unreads-channel').should('have.length', 1);
        cy.get('.plugin-unreads-post').should('have.length', 1);

        cy.apiGetChannelByName(testTeam.name, 'off-topic').then(({channel: offTopicChannel}) => {
            cy.get(`.plugin-unreads-channel__${offTopicChannel.id}`).within(() => {
                cy.get('.plugin-unreads-channel__header-icon').click();
            });
        });

        cy.get('.plugin-unreads-channel').should('have.length', 0);
        cy.get('.plugin-unreads-post').should('have.length', 0);
    })
})
