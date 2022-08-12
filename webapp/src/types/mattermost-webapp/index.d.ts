import React from 'react';

export interface PluginRegistry {
    registerRightHandSidebarComponent(component: React.ElementType, title: string);
    registerChannelHeaderButtonAction(icon: React.ElementType, action, dropdownText: string, tooltipText: string)
    registerAppBarComponent(iconUrl: string, action: () => any, tooltip_text: string | React.ElementType);

    // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
