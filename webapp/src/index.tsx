import React from 'react';
import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

// eslint-disable-next-line import/no-unresolved
import {PluginRegistry} from 'types/mattermost-webapp';

import UnreadView from 'components/unread_view/rhs';

import manifest from './manifest';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(UnreadView, 'Unreads');
        registry.registerChannelHeaderButtonAction(
            () => (<i className='icon fa fa-align-left' />),
            () => store.dispatch(toggleRHSPlugin),
            'Open Unread Sidebar',
            'Open Unread Sidebar',
        );
    }
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());
