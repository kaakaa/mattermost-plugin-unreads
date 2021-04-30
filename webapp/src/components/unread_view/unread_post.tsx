import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {Client4} from 'mattermost-redux/client';
import {Post} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {UserProfile} from 'mattermost-redux/types/users';
import {getUser} from 'mattermost-redux/selectors/entities/users';
import {Team} from 'mattermost-redux/types/teams';

// @ts-ignore
const {formatText, messageHtmlToComponent} = window.PostUtils;
// @ts-ignore
const WebappUtils = window.WebappUtils;

type Props = {
    post: Post,
    team: Team,
}

const PostView = styled.div`
    display: flex;
    align-items: flex-start;
    font-size: 0.9em;
    padding: 5px;
`

const PostIconView = styled.div`
    flex-basis: 37px;
    min-width: 37px;
    padding-right: 2px;
`
const PostIcon = styled.img`
    height: 32px;
    width: 32px;
    border-radius: 50%;
`

const PostContentsView = styled.div`
    flex-basis: auto;
`

const PostHeaderUser = styled.span`
    font-size: 1.2em;
    font-weight: bold;
`
const PostHeaderTime = styled.span`
    opacity: 0.5;
    margin: 0px 2px;
`
const PostContentsBody = styled.div`
    padding-top: 4px;
`

const handleJumpClick = (teamName: string, postId: string) => {
    return (e: any) => {
        e.preventDefault();
        WebappUtils.browserHistory.push(`/${teamName}/pl/${postId}`);
    }
}

const UnreadPost: FC<Props> = ({post, team}) => {
    const user = useSelector<GlobalState, UserProfile>(state => getUser(state, post.user_id));
    const profileUri = Client4.getProfilePictureUrl(user.id, user.last_picture_update);

    const formattedText = messageHtmlToComponent(
        formatText(
            post.message,
            {
                singlelie: false,
                mentionsHighlight: true,
                atMentions: true,
                team,
            }
        ),
        true, // isRHS
        {}
    );

    // TODO: show created_at apllying user's time zone settings (use date-fns?)
    // TODO: fix user name format as user's setting
    // TODO: snip longer post
    return (
        <>
            <PostView>
                <PostIconView>
                    <PostIcon src={profileUri}/>
                </PostIconView>
                <PostContentsView>
                    <div>
                        <PostHeaderUser>{user.username}</PostHeaderUser>
                        <PostHeaderTime>{post.create_at}</PostHeaderTime>
                        <a href='#' onClick={handleJumpClick(team.name, post.id)}>Jump</a>
                    </div>
                    <PostContentsBody>
                        {formattedText}
                    </PostContentsBody>
                </PostContentsView>
            </PostView>
        </>
    )
}

export default UnreadPost;
