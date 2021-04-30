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

type Props = {
    channelId: string
}

const UnreadChannelContent = styled.div`
    margin-left: 5px;
`

const ChannelHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin-bottom: 5px;
`
const ChannelHeaderTitle = styled.h2`font-size: 1.5em; font-weight: bold;`
const ChannelHeaderIconMenu = styled.i`padding-left: 5px;`
const ChannelHeaderDescription = styled.span`
    opacity: 0.7;
    padding-left: 5px;
`

const ChannelFooter = styled.div`
    margin: 5px;

`

const UnreadChannel: FC<Props> = ({channelId}) => {
    // TDOO: memorize?
    const dispatch = useDispatch();

    const markAsRead = (e:any) => {
        e.preventDefault();
        dispatch(markChannelAsRead(channel.id));
    }

    const handleJumpToChannel = (teamId: string, channelId: string) => {
        return (e: any) => {
            e.preventDefault();
            WebappUtils.browserHistory.push(`/${teamId}/channels/${channelId}`);
        }
    }

    const channel = useSelector<GlobalState, Channel>(state => getChannel(state, channelId));
    const team = useSelector<GlobalState, Team>(state => getTeam(state, channel.team_id));
    const membership = useSelector<GlobalState, any>(state => getMyChannelMember(state, channelId));
    const unreadCount = channel.total_msg_count - membership.msg_count;
    const allPosts = useSelector<GlobalState, PostWithFormatData[]>(state => makeGetPostsInChannel()(state, channel.id, -1)!);
    if (!allPosts) {
        return (
            <></>
        )
    }
    const posts = allPosts.filter(p => !isSystemMessage(p)).slice(0, Math.min(unreadCount, 3));

    let footer = <></>;
    if (unreadCount > 3) {
        footer = (
            <ChannelFooter>
                <a href='#' onClick={handleJumpToChannel(team.name, channel.id)}>See more unreads</a>
            </ChannelFooter>
        );
    }

    // TODO: tooltip for markAsRead icon
    return (
        <>
            <UnreadChannelContent>
                <ChannelHeader>
                    <ChannelHeaderTitle>{channel.display_name}</ChannelHeaderTitle>
                    <ChannelHeaderDescription>{`(${unreadCount} messages)`}</ChannelHeaderDescription>
                    <a href='#' onClick={(markAsRead)}>
                        <ChannelHeaderIconMenu className='icon fa fa-check-square'></ChannelHeaderIconMenu>
                    </a>
                </ChannelHeader>
                {posts.map((p) => {
                    var post = p as Post;
                    return <UnreadPost key={post.id} post={post} team={team}/>
                })}
                {footer}
                <hr/>
            </UnreadChannelContent>
        </>
    )
}
export default UnreadChannel;
