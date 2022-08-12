import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {GlobalState} from '@mattermost/types/store';

import {getUnreadChannelIds} from 'mattermost-redux/selectors/entities/channels';

import UnreadChannel from './unread_channel';

const View = styled.div`
    overflow-y: scroll;
`;

const UnreadView: FC<null> = () => {
    const unreadChannels = useSelector<GlobalState, string[]>((state) => getUnreadChannelIds(state));// getRecentOrderedUnreadChannelIds(state, null));
    const channels = unreadChannels.slice(0, 5).map((id: string) => (
        <UnreadChannel
            key={id}
            channelId={id}
        />
    ));

    return (
        <View>
            {channels}
        </View>
    );
};

export default UnreadView;
