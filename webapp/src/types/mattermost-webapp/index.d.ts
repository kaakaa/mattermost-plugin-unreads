import React from 'react';

export interface PluginRegistry {
    registerRightHandSidebarComponent(component: React.ElementType, title: string);
    registerChannelHeaderButtonAction(icon: React.ElementType, action, dropdownText: string, tooltipText: string)

    // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
