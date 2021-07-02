import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import {markChannelAsRead} from 'mattermost-redux/actions/channels';
import {Post, PostWithFormatData} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {makeGetPostsInChannel} from 'mattermost-redux/selectors/entities/posts';
import {getUserIdFromChannelName, isDirectChannel, isGroupChannel} from 'mattermost-redux/utils/channel_utils';
import {isSystemMessage} from 'mattermost-redux/utils/post_utils';
import {getChannel, getMyChannelMember} from 'mattermost-redux/selectors/entities/channels';
import {Channel} from 'mattermost-redux/types/channels';
import {getCurrentTeam, getTeam} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';
import {Team} from 'mattermost-redux/types/teams';

import UnreadPost from 'components/unread_view/unread_post';

// @ts-ignore
const WebappUtils = window.WebappUtils;

// @ts-ignore
const {OverlayTrigger, Tooltip} = window.ReactBootstrap;

const UnreadChannelContent = styled.div`
    margin-left: 5px;
`;
const ChannelHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin-bottom: 5px;
`;
const ChannelHeaderTitle = styled.h2`font-size: 1.2em; font-weight: bold;`;
const ChannelHeaderIconMenu = styled.i`padding-left: 5px;`;
const ChannelHeaderDescription = styled.span`
    opacity: 0.7;
    padding-left: 5px;
`;
const ChannelFooter = styled.div`
    margin: 5px;
`;

interface Props {
    channelId: string;
}

const getTeamFromChannel = (state: GlobalState, channel: Channel): Team => {
    if (isDirectChannel(channel) || isGroupChannel(channel)) {
        // If DM or GM, Channel object doesn't have team_id. Instead, use current team.
        return getCurrentTeam(state);
    }
    return getTeam(state, channel.team_id);
};

const getChannelName = (state: GlobalState, channel: Channel, currentUserId: string): string => {
    if (isDirectChannel(channel)) {
        const userId = getUserIdFromChannelName(currentUserId, channel.name);
        const user = getUser(state, userId);
        return `@${user.username}`;
    }
    return channel.display_name;
};

const getChannelLink = (state: GlobalState, team: Team, channel: Channel, currentUserId: string): string => {
    if (isDirectChannel(channel)) {
        const userId = getUserIdFromChannelName(currentUserId, channel.name);
        const user = getUser(state, userId);
        return `/${team.name}/messages/@${user.username}`;
    } else if (isGroupChannel(channel)) {
        return `/${team.name}/messages/${channel.name}`;
    }
    return `/${team.name}/channels/${channel.id}`;
};

const UnreadChannel: FC<Props> = (props: Props) => {
    const {channelId} = props;

    // TDOO: memorize?
    const dispatch = useDispatch();
    const markAsRead = (e: any) => {
        e.preventDefault();
        dispatch(markChannelAsRead(channel.id));
    };

    const handleJumpToChannel = (channelLink: string) => {
        return (e: any) => {
            e.preventDefault();
            WebappUtils.browserHistory.push(channelLink);
        };
    };

    const currentUserId = useSelector<GlobalState, string>(getCurrentUserId);
    const channel = useSelector<GlobalState, Channel>((state) => getChannel(state, channelId));
    const team = useSelector<GlobalState, Team>((state) => getTeamFromChannel(state, channel));

    const channelLink = useSelector<GlobalState, string>((state) => getChannelLink(state, team, channel, currentUserId));
    const membership = useSelector<GlobalState, any>((state) => getMyChannelMember(state, channelId));
    const allPosts = useSelector<GlobalState, PostWithFormatData[]>((state) => makeGetPostsInChannel()(state, channel.id, -1)!);

    // There is a case where membership.mention_count is more than one even though unreadCount == 0.
    // e.g.: When someone invite you in new channel, system post message with mention.
    // But ignoring that case is not big deal.
    const unreadCount = channel.total_msg_count - membership.msg_count;
    if (!allPosts || unreadCount === 0) {
        return <></>;
    }
    const posts = allPosts.filter((p) => !isSystemMessage(p)).slice(0, Math.min(unreadCount, 3));

    let footer = <></>;
    if (unreadCount > 3 && channelLink) {
        footer = (
            <ChannelFooter id='plugin-unreads-channel__footer'>
                <a
                    href='#'
                    onClick={handleJumpToChannel(channelLink)}
                >
                    {'See more unreads'}
                </a>
            </ChannelFooter>
        );
    }

    // TODO: add accordion to unread channe lcontent
    return (
        <>
            <UnreadChannelContent>
                <ChannelHeader className={`plugin-unreads-channel plugin-unreads-channel__${channel.id}`}>
                    <ChannelHeaderTitle className='plugin-unreads-channel__header-title'>{channel.display_name}</ChannelHeaderTitle>
                    <ChannelHeaderDescription className='plugin-unreads-channel__header-description'>{`(${unreadCount} messages)`}</ChannelHeaderDescription>
                    <OverlayTrigger
                        key={channel.id}
                        placement={'bottom'}
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                {'Mark as read'}
                            </Tooltip>
                        }
                    >
                        <a
                            href='#'
                            onClick={(markAsRead)}
                        >
                            <ChannelHeaderIconMenu className='icon fa fa-check-square plugin-unreads-channel__header-icon' />
                        </a>
                    </OverlayTrigger>
                </ChannelHeader>
                {posts.map((p) => {
                    const post = p as Post;
                    return (
                        <UnreadPost
                            key={post.id}
                            post={post}
                            team={team}
                        />
                    );
                })}
                {footer}
                <hr />
            </UnreadChannelContent>
        </>
    );
};

export default UnreadChannel;
