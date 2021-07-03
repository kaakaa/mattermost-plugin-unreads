import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {GlobalState} from 'mattermost-redux/types/store';

import UnreadChannel from './unread_channel';
import {getRecentOrderedUnreadChannelIds} from 'utils/utils';

const View = styled.div`
    overflow-y: scroll;
`;

const UnreadView: FC<null> = () => {
    const unreadChannels = useSelector<GlobalState, string[]>((state) => getRecentOrderedUnreadChannelIds(state, null));
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
