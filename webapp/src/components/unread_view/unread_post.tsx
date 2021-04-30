import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {utcToZonedTime, format} from 'date-fns-tz';
import intervalToDuration from 'date-fns/intervalToDuration';

import {Client4} from 'mattermost-redux/client';
import {Post} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {UserProfile} from 'mattermost-redux/types/users';
import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';
import {Team} from 'mattermost-redux/types/teams';
import {getBool, getTeammateNameDisplaySetting} from 'mattermost-redux/selectors/entities/preferences';
import {displayUsername} from 'mattermost-redux/utils/user_utils';
import {getUserCurrentTimezone} from 'mattermost-redux/utils/timezone_utils';
import {Preferences} from 'mattermost-redux/constants';

// @ts-ignore
const {formatText, messageHtmlToComponent} = window.PostUtils;

// @ts-ignore
const WebappUtils = window.WebappUtils;

const PostView = styled.div`
    display: flex;
    align-items: flex-start;
    font-size: 0.9em;
    padding: 5px;
`;
const PostIconView = styled.div`
    flex-basis: 37px;
    min-width: 37px;
    padding-right: 2px;
`;
const PostIcon = styled.img`
    height: 32px;
    width: 32px;
    border-radius: 50%;
`;
const PostContentsView = styled.div`
    flex-basis: auto;
    max-height: 300px;
`;
const PostHeaderUser = styled.span`
    font-size: 1.2em;
    font-weight: bold;
`;
const PostHeaderTime = styled.span`
    opacity: 0.5;
    margin-left: 5px;
    margin-right: 15px;
`;
const PostContentsBody = styled.div`
    padding-top: 4px;
    max-height: 265px;
    overflow: hidden;
    while-space: nowrap;
    text-overflow: ellipsis;
`;

const handleJumpClick = (teamName: string, postId: string) => {
    return (e: any) => {
        e.preventDefault();
        WebappUtils.browserHistory.push(`/${teamName}/pl/${postId}`);
    };
};

interface Props {
    post: Post;
    team: Team;
}

const UnreadPost: FC<Props> = (props: Props) => {
    const {post, team} = props;
    const currentUserId = useSelector<GlobalState, string>(getCurrentUserId);
    const currentUser = useSelector<GlobalState, UserProfile>((state) => getUser(state, currentUserId));
    let teammateNameSetting = useSelector<GlobalState, string|undefined>(getTeammateNameDisplaySetting);
    if (!teammateNameSetting) {
        teammateNameSetting = '';
    }
    let tz = getUserCurrentTimezone(currentUser.timezone);
    if (!tz) {
        tz = '';
    }

    const isMilitary = useSelector<GlobalState, boolean>((state) => getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME));
    let timeFormat = isMilitary ? 'HH:mm' : 'p';

    // TODO: this will cause always re-render. it should be to introduce date separator.
    const interval: Duration = intervalToDuration({
        start: utcToZonedTime(post.create_at, tz),
        end: utcToZonedTime(Date.now(), tz),
    });
    if (interval.days && interval.days > 0) {
        timeFormat = `PP ${timeFormat}`;
    }
    const createdAt = format(utcToZonedTime(post.create_at, tz), timeFormat, {timeZone: tz});

    const user = useSelector<GlobalState, UserProfile>((state) => getUser(state, post.user_id));
    const profileUri = Client4.getProfilePictureUrl(user.id, user.last_picture_update);
    const username = displayUsername(user, teammateNameSetting!);

    const formattedText = messageHtmlToComponent(
        formatText(
            post.message,
            {
                singlelie: false,
                mentionsHighlight: true,
                atMentions: true,
                team,
            },
        ),
        true, // isRHS
        {},
    );

    // TODO: show custom status
    // TODO: show user's status
    return (
        <>
            <PostView>
                <PostIconView>
                    <PostIcon src={profileUri}/>
                </PostIconView>
                <PostContentsView>
                    <div>
                        <PostHeaderUser>{username}</PostHeaderUser>
                        <PostHeaderTime>{createdAt}</PostHeaderTime>
                        <a
                            href='#'
                            onClick={handleJumpClick(team.name, post.id)}
                        >
                            {'Jump'}
                        </a>
                    </div>
                    <PostContentsBody>
                        {formattedText}
                    </PostContentsBody>
                </PostContentsView>
            </PostView>
        </>
    );
};

export default UnreadPost;
