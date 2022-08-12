import React from 'react';
import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import UnreadView from 'src/components/unread_view/rhs';

import {PluginRegistry} from './types/mattermost-webapp';

import manifest from './manifest';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        const siteUrl = getConfig(store.getState())?.SiteURL || '';

        // Icon is generated by DALLE with the following query:
        // `Simple icon for notifying that there is some unread messages, digital art, drawing, in navy circle as background, vibrant, cheerful, cartoon, without text`
        const iconURL = `${siteUrl}/plugins/${manifest.id}/public/app-bar-icon.png`;

        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(UnreadView, 'Unreads');

        if (registry.registerChannelHeaderButtonAction) {
            registry.registerChannelHeaderButtonAction(

                // TODO: add 'chennel-header_icon--active' when enabled. ref: incident-colleboration plugin.
                () => (
                    <img
                        width='24px'
                        height='24px'
                        style={{borderRadius: '50%'}}
                        src={`${iconURL}`}
                    />
                ),
                () => store.dispatch(toggleRHSPlugin),
                'Open Unread Sidebar',
                'Open Unread Sidebar',
            );
        }

        if (registry.registerAppBarComponent) {
            registry.registerAppBarComponent(iconURL, () => store.dispatch(toggleRHSPlugin), 'Open Unread Sidebar');
        }
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
