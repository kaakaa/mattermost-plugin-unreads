import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import {ActionFunc} from 'mattermost-redux/types/actions';
import {markChannelAsRead} from 'mattermost-redux/actions/channels';
import {Post, PostWithFormatData} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {makeGetPostsInChannel} from 'mattermost-redux/selectors/entities/posts';
import {isSystemMessage} from 'mattermost-redux/utils/post_utils';
import {getChannel, getMyChannelMember} from 'mattermost-redux/selectors/entities/channels';
import {Channel} from 'mattermost-redux/types/channels';

import UnreadPost from 'components/unread_view/unread_post';

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
const ChannelHeaderTitle = styled.h2`font-size: 2em; font-weight: bold;`
const ChannelHeaderIconMenu = styled.i`padding-left: 5px;`
const ChannelHeaderDescription = styled.span`
    opacity: 0.7;
    padding-left: 5px;
`

const UnreadChannel: FC<Props> = ({channelId}) => {
    // TDOO: memorize?
    const dispatch = useDispatch();

    const channel = useSelector<GlobalState, Channel>(state => getChannel(state, channelId));
    const membership = useSelector<GlobalState, any>(state => getMyChannelMember(state, channelId));
    const unreadCount = channel.total_msg_count - membership.msg_count;
    const allPosts = useSelector<GlobalState, PostWithFormatData[]>(state => makeGetPostsInChannel()(state, channel.id, -1)!);
    if (!allPosts) {
        return (
            <></>
        )
    }
    const posts = allPosts.filter(p => !isSystemMessage(p)).slice(0, Math.min(unreadCount, 3));

    let footerText = '';
    if (unreadCount > 3) {
        footerText = `(${unreadCount - 3} messages)`
    }

    const markAsRead = (e:any) => {
        e.preventDefault();
        dispatch(markChannelAsRead(channel.id));
    }
    // TODO: sum up with same user's consective posts
    return (
        <>
            <UnreadChannelContent>
                <ChannelHeader>
                    <ChannelHeaderTitle>{channel.display_name}</ChannelHeaderTitle>
                    <ChannelHeaderDescription>{footerText}</ChannelHeaderDescription>
                    <a href='#' onClick={(markAsRead)}>
                        <ChannelHeaderIconMenu className='icon fa fa-check-square'></ChannelHeaderIconMenu>
                    </a>
                </ChannelHeader>
                {posts.map((p) => {
                    var post = p as Post;
                    return <UnreadPost key={post.id} post={post} teamId={channel.team_id}/>
                })}
                <hr/>
            </UnreadChannelContent>
        </>
    )
}
export default UnreadChannel;
