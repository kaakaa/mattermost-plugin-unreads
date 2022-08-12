import React from 'react';
import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

import UnreadView from 'src/components/unread_view/rhs';

import {PluginRegistry} from './types/mattermost-webapp';

import manifest from './manifest';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(UnreadView, 'Unreads');
        registry.registerChannelHeaderButtonAction(

            // TODO: add 'chennel-header_icon--active' when enabled. ref: incident-colleboration plugin.
            () => (<i className='icon fa fa-align-left icon__plugin-unreads' />),
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
    type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    }
}

window.registerPlugin(manifest.id, new Plugin());
