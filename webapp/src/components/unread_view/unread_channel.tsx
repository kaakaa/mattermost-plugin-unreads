import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import {markChannelAsRead} from 'mattermost-redux/actions/channels';
import {Post, PostWithFormatData} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {makeGetPostsInChannel} from 'mattermost-redux/selectors/entities/posts';
import {isSystemMessage} from 'mattermost-redux/utils/post_utils';
import {getChannel, getMyChannelMember} from 'mattermost-redux/selectors/entities/channels';
import {Channel} from 'mattermost-redux/types/channels';
import {getTeam} from 'mattermost-redux/selectors/entities/teams';
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
const ChannelHeaderTitle = styled.h2`font-size: 1.5em; font-weight: bold;`;
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

const UnreadChannel: FC<Props> = (props: Props) => {
    const {channelId} = props;

    // TDOO: memorize?
    const dispatch = useDispatch();
    const markAsRead = (e: any) => {
        e.preventDefault();
        dispatch(markChannelAsRead(channel.id));
    };

    const handleJumpToChannel = (tid: string, cid: string) => {
        return (e: any) => {
            e.preventDefault();
            WebappUtils.browserHistory.push(`/${tid}/channels/${cid}`);
        };
    };

    const channel = useSelector<GlobalState, Channel>((state) => getChannel(state, channelId));
    const team = useSelector<GlobalState, Team>((state) => getTeam(state, channel.team_id));
    const membership = useSelector<GlobalState, any>((state) => getMyChannelMember(state, channelId));
    const unreadCount = channel.total_msg_count - membership.msg_count;
    const allPosts = useSelector<GlobalState, PostWithFormatData[]>((state) => makeGetPostsInChannel()(state, channel.id, -1)!);
    if (!allPosts) {
        return (
            <></>
        );
    }
    const posts = allPosts.filter((p) => !isSystemMessage(p)).slice(0, Math.min(unreadCount, 3));

    let footer = <></>;
    if (unreadCount > 3) {
        footer = (
            <ChannelFooter id='plugin-unreads-channel__footer'>
                <a
                    href='#'
                    onClick={handleJumpToChannel(team.name, channel.id)}
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
