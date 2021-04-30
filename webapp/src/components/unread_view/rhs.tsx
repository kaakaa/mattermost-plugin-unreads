import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {GlobalState} from 'mattermost-redux/types/store';
import {getSortedUnreadChannelIds} from 'mattermost-redux/selectors/entities/channels';

import UnreadChannel from './unread_channel';

const View = styled.div`
    overflow-y: scroll;
`;

const UnreadView: FC<null> = () => {
    const unreadChannels = useSelector<GlobalState, string[]>((state) => getSortedUnreadChannelIds(state, null, false, false, 'recent'));
    const channels = unreadChannels.map((id: string) => (
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
