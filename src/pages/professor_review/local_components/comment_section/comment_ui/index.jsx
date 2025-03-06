import './style.scss';
import { user_details_cache } from '../../../../../utils/cache';
import { OutsideClickDetector } from '../../../../../components';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { comments_cache, replies_cache } from '../../../../../utils/cache';
import useCustomDialog from '../../../../../custom/dialogs';

CommentUI.propTypes = {
    user_id: PropTypes.string,
    comment_id: PropTypes.string.isRequired,
    parent_id: PropTypes.string,
    username: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    dislikes: PropTypes.number.isRequired,
    replies_count: PropTypes.number,
    user_vote_type: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    edited: PropTypes.bool.isRequired,
    openReply: PropTypes.func,
    prof_id: PropTypes.string,
    showAuthenticationWindow: PropTypes.func,
    is_same_college: PropTypes.bool,
    openCommentEdit: PropTypes.func,
    deleteComment: PropTypes.func
}
export default function CommentUI({
    user_id,
    comment_id,
    parent_id,
    username,
    timestamp,
    content,
    likes,
    dislikes,
    replies_count,
    user_vote_type,
    edited,
    openReply = () => { },
    prof_id,
    showAuthenticationWindow,
    is_same_college,
    openCommentEdit,
    deleteComment
}) {
    const customDialogs = useCustomDialog();
    const current_user_id = user_details_cache.get('user_id');
    const [showMenu, setShowMenu] = useState(false);
    const menubtn_ref = useRef(null);
    const [userVoteType, setUserVoteType] = useState(user_vote_type);
    const [votes, setVotes] = useState({ likes, dislikes });
    const [disableVoting, setDisableVoting] = useState(false);

    const updateVoteState = (new_vote) => {
        let new_votes = null;

        if (!userVoteType && new_vote == 1) { // liked
            new_votes = { ...votes, likes: votes.likes + 1 };
        }
        else if (!userVoteType && new_vote == 2) { // disliked
            new_votes = { ...votes, dislikes: votes.dislikes + 1 };
        }
        else if (userVoteType === 1 && !new_vote) { // unliked
            new_votes = { ...votes, likes: votes.likes - 1 };
        }
        else if (userVoteType === 2 && !new_vote) { // undisliked
            new_votes = { ...votes, dislikes: votes.dislikes - 1 };
        }
        else if (userVoteType === 1 && new_vote == 2) { // switched to dislike
            new_votes = { likes: votes.likes - 1, dislikes: votes.dislikes + 1 };
        }
        else if (userVoteType === 2 && new_vote == 1) { // switched to like
            new_votes = { likes: votes.likes + 1, dislikes: votes.dislikes - 1 };
        }

        setUserVoteType(new_vote);
        setVotes(new_votes);

        // updating cache
        if (!parent_id) {
            // comment cache , // Format: { prof_id: [comment1, comment2, ...] }
            comments_cache.get(prof_id).forEach(comment => {
                if (comment.comment_id === comment_id) {
                    comment.user_vote_type = new_vote;
                    comment.likes = new_votes.likes;
                    comment.dislikes = new_votes.dislikes;
                }
            });
        }
        else {
            // reply cache, // Format: { comment_id: [reply1, reply2, ...] }
            replies_cache.get(parent_id).forEach(reply => {
                if (reply.comment_id === comment_id) {
                    reply.user_vote_type = new_vote;
                    reply.likes = new_votes.likes;
                    reply.dislikes = new_votes.dislikes;
                }
            })
        }
    }


    async function handleVote(type) {
        if (!user_details_cache.get('user_id')) return showAuthenticationWindow();
        if (user_details_cache.get('user_id') === user_id) return; // voting on own comment
        if (!is_same_college) return; // user is from different college

        setDisableVoting(true);

        const new_vote = userVoteType === type ? null : type; // 1 = like, 2 = dislike, null = unvote

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/vote`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment_id,
                    new_vote_type: new_vote
                })
            });

            if (response.ok) {
                updateVoteState(new_vote);
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: 'Failed to vote. Please try again later.',
                })
            }
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: 'An error occurred while voting. Please try again later.',
            })
        }
        finally {
            setDisableVoting(false);
        }

    }

    return (
        <div className="comment-ui">
            <div className="comment-info">
                {current_user_id !== user_id && username && <p className="user-name">{username}</p>}
                <p className={`timestamp ${current_user_id === user_id ? 'bold' : ''}`}>{new Date(timestamp).toLocaleString()}</p>
            </div>

            {current_user_id === user_id && <div className="menu no-select">
                <div className="menu-btn" onClick={() => setShowMenu(!showMenu)} ref={menubtn_ref}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="menu-btn-icon" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </div>

                {showMenu && <OutsideClickDetector style={{ position: 'absolute', top: '2.5rem', right: '1rem' }} closePopup={() => setShowMenu(false)} buttonRef={menubtn_ref}>
                    <div className="menu-items">
                        <div className="menu-item edit" onClick={()=> {openCommentEdit(comment_id, parent_id); setShowMenu(false)}}>Edit</div>
                        <div className="menu-item" onClick={()=> deleteComment(comment_id, parent_id)}>Delete</div>
                    </div>
                </OutsideClickDetector>}

            </div>}

            <div className="comment-text">
                <p>{content} {edited && <span className="edited-label">Edited</span>}</p>
            </div>

            <div className={`comment-actions ${current_user_id === user_id ? 'current-user' : ''}`}>
                <button disabled={disableVoting} className={`btn-like ${userVoteType === 1 ? 'active' : ''}`} onClick={() => handleVote(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="thumb-outline" viewBox="0 0 16 16">
                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="thumb-fill" viewBox="0 0 16 16">
                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.964.22.817.533 2.512.062 4.51a9.84 9.84 0 0 1 .443-.05c.713-.065 1.669-.072 2.516.21.518.173.994.68 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.162 3.162 0 0 1-.488.9c.054.153.076.313.076.465 0 .306-.089.626-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.826 4.826 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.616.849-.231 1.574-.786 2.132-1.41.56-.626.914-1.279 1.039-1.638.199-.575.356-1.54.428-2.59z" />
                    </svg>
                    {!disableVoting ?
                        <span className="count">{votes.likes}</span>
                        :
                        <div className="spinner" />
                    }
                </button>
                <button disabled={disableVoting} className={`btn-dislike ${userVoteType === 2 ? 'active' : ''}`} onClick={() => handleVote(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="thumb-outline" viewBox="0 0 16 16">
                        <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="thumb-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
                    </svg>
                    {!disableVoting ?
                        <span className="count">{votes.dislikes}</span>
                        :
                        <div className="spinner" />
                    }
                </button>
                {!parent_id && <button className='btn-reply' onClick={() => openReply(comment_id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        <path d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                    </svg>
                    <span className="count">{replies_count}</span>
                </button>}
            </div>
        </div>
    )
}