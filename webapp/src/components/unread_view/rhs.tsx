import React, {FC} from 'react';
import {useSelector} from 'react-redux';

import {GlobalState} from 'mattermost-redux/types/store';
import {getSortedUnreadChannelIds} from 'mattermost-redux/selectors/entities/channels';

import UnreadChannel from './unread_channel';

const UnreadView: FC<null> = () => {
    const unreadChannels = useSelector<GlobalState, string[]>(state => getSortedUnreadChannelIds(state, null, false, false, 'recent'));
    const channels = unreadChannels
        .map(id => <UnreadChannel key={id} channelId={id}/>);

    console.log('unread_view');
    return (
        <div>
            {channels}
        </div>
    );
}
export default UnreadView;
