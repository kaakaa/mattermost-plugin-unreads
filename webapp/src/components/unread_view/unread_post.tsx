import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import {Client4} from 'mattermost-redux/client';
import {Post} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {Team} from 'mattermost-redux/types/teams';
import {UserProfile} from 'mattermost-redux/types/users';
import {getTeam} from 'mattermost-redux/selectors/entities/teams';
import {getUser} from 'mattermost-redux/selectors/entities/users';

// @ts-ignore
const PostUtils = window.PostUtils;
// @ts-ignore
const WebappUtils = window.WebappUtils;

type Props = {
    post: Post,
    teamId: string,
}

const PostView = styled.div`
    display: flex;
    align-items: flex-start;
    font-size: 0.8em;
    padding: 5px;
`

const PostIconView = styled.div`
    flex-basis: 37px;
    paddingRight: 2px;
`
const PostIcon = styled.img`
    height: 32px;
    width: 32px;
    border-radius: 50%;
`

const PostContentsView = styled.div``

const PostHeaderUser = styled.span`
    font-size: 1.2em;
    font-weight: bold;
`
const PostHeaderTime = styled.span`
    opacity: 0.5;
    margin: 0px 2px;
`

const handleJumpClick = (teamName: string, postId: string) => {
    return (e: any) => {
        e.preventDefault();
        WebappUtils.browserHistory.push(`/${teamName}/pl/${postId}`);
    }
}

const UnreadPost: FC<Props> = ({post, teamId}) => {
    const dispatch = useDispatch();

    const user = useSelector<GlobalState, UserProfile>(state => getUser(state, post.user_id));
    const team = useSelector<GlobalState, Team>(state => getTeam(state, teamId));
    const profileUri = Client4.getProfilePictureUrl(user.id, user.last_picture_update);
    const postLink = `${Client4.getUrl()}/${team.name}/pl/${post.id}`
    // TODO: show created_at apllying user's time zone settings
    // TODO: fix user name format as user's setting
    // TODO: change jumping link to switching channel

    const formattedText = PostUtils.messageHtmlToComponent(
        PostUtils.formatText(post.message),
        false, // isRHS
        {}
    );
    return (
        <>
            <PostView>
                <PostIconView>
                    <PostIcon src={profileUri}/>
                </PostIconView>
                <PostContentsView>
                    <p>
                        <PostHeaderUser>{user.username}</PostHeaderUser>
                        <PostHeaderTime>{post.create_at}</PostHeaderTime>
                        <a href='#' onClick={handleJumpClick(team.name, post.id)}>Jump</a>
                    </p>
                    <p>{formattedText}</p>
                </PostContentsView>
            </PostView>
        </>
    )
}

export default UnreadPost;