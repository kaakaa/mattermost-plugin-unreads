import {getUnreadChannels, mapAndSortChannelIds} from "mattermost-redux/selectors/entities/channels";
import {getMyChannelMemberships, getCurrentUser} from "mattermost-redux/selectors/entities/common";
import {getLastPostPerChannel} from 'mattermost-redux/selectors/entities/posts';

import {Channel} from 'mattermost-redux/types/channels';
import {Post} from 'mattermost-redux/types/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {RelationOneToOne} from 'mattermost-redux/types/utilities';
import {createIdsSelector} from 'mattermost-redux/utils/helpers';

type SortingType = 'recent' | 'alpha';

// `getSortedUnreadChannelIds` in mattermost-redux has fixed flag value that `sortMentionsFirst = true`.
//   refs: https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/selectors/entities/channels.ts#L123
// `sortMentionsFirst = true` is not intended behavior in this plugin, so define `sortMentionsFirst = true` verison of that method.
export const getRecentOrderedUnreadChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null) => string[] = createIdsSelector(
    getUnreadChannels,
    getCurrentUser,
    getMyChannelMemberships,
    getLastPostPerChannel,
    (state: GlobalState, lastUnreadChannel: Channel | null, sorting: SortingType = 'recent') => sorting,
    (channels, currentUser, myMembers, lastPosts: RelationOneToOne<Channel, Post>, sorting: SortingType) => {
        return mapAndSortChannelIds(channels, currentUser, myMembers, lastPosts, sorting, false);
    },
);
