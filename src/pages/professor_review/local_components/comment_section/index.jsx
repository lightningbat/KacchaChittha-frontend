import './style.scss'
import { useEffect, useRef, useState } from 'react';
import CommentUI from './comment_ui';
import { user_details_cache, comments_cache, replies_cache } from '../../../../utils/cache';
import useCustomDialog from '../../../../custom/dialogs';
import { Spinner } from '../../../../custom/loading_animations';
import PropTypes from 'prop-types'

const totalComments = new Map(); // Format: {prof_id: count}

CommentSection.propTypes = {
    prof_id: PropTypes.string,
    is_same_college: PropTypes.bool,
    showAuthenticationWindow: PropTypes.func
}
export default function CommentSection({ prof_id, is_same_college, showAuthenticationWindow }) {
    const customDialogs = useCustomDialog();
    const [commentCounts, setCommentCounts] = useState("Loading...");
    const [userComments, setUserComments] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [replyList, setReplyList] = useState([]);
    const [postingComment, setPostingComment] = useState(false); // disable comment submission when posting comment
    const [inputError, setInputError] = useState("");
    const [editCommentId, setEditCommentId] = useState({comment_id: null, parent_id: null});
    const [editCommentText, setEditCommentText] = useState("");
    const commentInputRef = useRef(null);
    const [commentBtnDisabled, setCommentBtnDisabled] = useState(true);


    //distribute comments into user comments and other comments
    function distributeComments(comments) {
        const current_user_id = user_details_cache.get('user_id');

        const current_user_comments = []
        const other_comments = []

        comments.forEach(comment => {
            if (comment.user_id === current_user_id) {
                current_user_comments.push(comment);
                return;
            }
            other_comments.push(comment);
        })

        // sorting comments by timestamp
        current_user_comments.sort((a, b) => b.timestamp - a.timestamp);
        other_comments.sort((a, b) => b.timestamp - a.timestamp);

        setUserComments(current_user_comments);
        setCommentList(other_comments);
        setCommentCounts(totalComments.get(prof_id));
    }

    // getting comments
    useEffect(() => {
        (async () => {
            try {
                // getting comments from cache (if available)
                if (comments_cache.has(prof_id)) {
                    distributeComments(comments_cache.get(prof_id));
                    return;
                }
                // fetching comments
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-comments/${prof_id}/null`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.status === 200) {
                    const data = await response.json();
                    comments_cache.set(prof_id, data.comments);
                    totalComments.set(prof_id, data.comments_count);

                    distributeComments(data.comments);
                }

            } catch (error) {
                console.error(error);
            }
        })()
    }, [])

    // submit comment and reply
    async function handleCommentSubmit(e) {
        e.preventDefault();
        setInputError("");
        setPostingComment(true);

        // check if user is logged in
        if (!user_details_cache.get('user_id')) {
            showAuthenticationWindow();
            setPostingComment(false);
            return;
        }

        // getting comment text
        const comment_text = e.target[1].value.trim();
        // checking if comment length is valid
        if (comment_text.length == 0 || comment_text.length > 300){
            setInputError("Comment length must be between 1 and 300 characters.");
            setPostingComment(false);
            return;
        }

        // regex to check if the comment text contains only alphabets, numbers, emojis and spaces (also .)
        // const regex = /^[\p{L}\p{N}\p{Emoji}\s.]+$/u;
        // if (!regex.test(comment_text)) {
        //     setInputError("Only alphabets, numbers and emojis allowed.");
        //     return;
        // }

        // redirecting to edit comment
        if (editCommentId?.comment_id) {
            editComment(comment_text);
            return;
        }

        try {
            const parent_id = selectedComment;
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/add-comment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prof_id, parent_id, comment_text })
            });

            setPostingComment(false); // enabling rating box

            if (response.ok) {
                e.target[1].value = ""; // clearing comment input

                // updating total comments count
                totalComments.set(prof_id, totalComments.get(prof_id) + 1);
                setCommentCounts(totalComments.get(prof_id));

                const response_data = await response.json();

                const comment_doc = {
                    comment_id: response_data.comment_id,
                    prof_id,
                    parent_id,
                    user_id: user_details_cache.get('user_id'),
                    content: comment_text,
                    edited: false,
                    timestamp: response_data.timestamp,
                    likes: 0,
                    dislikes: 0,
                    replies_count: 0,
                }

                // Managing replies
                if (parent_id) {
                    if (!replies_cache.has(parent_id)) {
                        replies_cache.set(parent_id, []);
                    }
                    // updating replies cache
                    const new_replies = [comment_doc, ...replies_cache.get(parent_id)];
                    replies_cache.set(parent_id, new_replies);
                    // updating replies count
                    comments_cache.get(prof_id).find(comment => comment.comment_id === parent_id).replies_count += 1;

                    // updating state
                    openReply(parent_id);
                }
                // Managing comments
                else {
                    comments_cache.get(prof_id).push(comment_doc);
                    distributeComments(comments_cache.get(prof_id));
                }
            } else {
                setInputError("Failed to post comment. Please try again.");
            }
        } catch (error) {
            setPostingComment(false); // enabling rating box
            console.error(error);
            setInputError("Error while posting comment. Please try again.");
        }
    }

    // open replies of a comment and also fetch replies from backend
    async function openReply(comment_id) {
        setSelectedComment(comment_id);

        if (!replies_cache.has(comment_id)) {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-comments/${prof_id}/${comment_id}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    replies_cache.set(comment_id, data);
                }
                else {
                    customDialogs({
                        type: 'alert',
                        description: 'Failed to get replies. Please try again.'
                    })
                    return;
                }
            } catch (error) {
                console.error(error);
                customDialogs({
                    type: 'alert',
                    description: 'Error while getting replies. Please try again.'
                })
                return;
            }
        }
        const replies = replies_cache.get(comment_id);
        // sorting replies by timestamp
        replies.sort((a, b) => b.timestamp - a.timestamp);
        setReplyList(replies);
    }

    const openCommentEditing = (comment_id, parent_id) => {
        let comment_text = null;
        if (parent_id) {
            comment_text = replies_cache.get(parent_id).find(reply => reply.comment_id === comment_id).content;
        }
        else {
            comment_text = comments_cache.get(prof_id).find(comment => comment.comment_id === comment_id).content;
        }

        setEditCommentId({ comment_id, parent_id });
        setEditCommentText(comment_text);
        commentInputRef.current.value = comment_text;
        commentInputRef.current.focus();
    }

    async function editComment(comment_text) {
        const { comment_id, parent_id } = editCommentId;
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/edit-comment`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment_id, comment_text })
            });

            if (response.ok) {
                // updating content and edited flag
                if (parent_id) {
                    replies_cache.get(parent_id).find(reply => reply.comment_id === comment_id).content = comment_text;
                    replies_cache.get(parent_id).find(reply => reply.comment_id === comment_id).edited = true;
                    setReplyList(replies_cache.get(parent_id));
                }
                else {
                    comments_cache.get(prof_id).find(comment => comment.comment_id === comment_id).content = comment_text;
                    comments_cache.get(prof_id).find(comment => comment.comment_id === comment_id).edited = true;
                    distributeComments(comments_cache.get(prof_id));
                }

                setEditCommentId({ comment_id: null, parent_id: null });
                // clearing comment input
                setEditCommentText("");
                commentInputRef.current.value = "";
                
            }
            else {
                setInputError("Failed to edit comment. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setInputError("Error while editing comment. Please try again.");
        } finally {
            setPostingComment(false);
        }
    }

    async function deleteComment(comment_id, parent_id) {
        const confirmation = await customDialogs({
            type: 'confirm',
            title: 'Delete Comment?',
            description: !parent_id ? "All replies to this comment will also be deleted." : " 'Are you sure you want to delete this comment?",
        })
        if (!confirmation) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/delete-comment/${comment_id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                if (parent_id) {
                    // deleting reply
                    replies_cache.get(parent_id).splice(replies_cache.get(parent_id).findIndex(reply => reply.comment_id === comment_id), 1);
                    // updating parent comment replies count
                    comments_cache.get(prof_id).find(comment => comment.comment_id === parent_id).replies_count -= 1;
                    // updating total comment count
                    totalComments.set(prof_id, totalComments.get(prof_id) - 1);
                    // updating state
                    setCommentCounts(totalComments.get(prof_id));
                    distributeComments(comments_cache.get(prof_id));
                    setReplyList(replies_cache.get(parent_id));
                }
                else {
                    // counting number of replies to update total comment count
                    const deleted_replies_count = replies_cache.has(comment_id) ? replies_cache.get(comment_id).length : 0;
                    // deleting comment
                    comments_cache.get(prof_id).splice(comments_cache.get(prof_id).findIndex(comment => comment.comment_id === comment_id), 1);
                    // deleting replies
                    replies_cache.delete(comment_id);
                    // updating total comment count
                    totalComments.set(prof_id, totalComments.get(prof_id) - (deleted_replies_count + 1));
                    // updating state
                    setCommentCounts(totalComments.get(prof_id));
                    setSelectedComment(null);
                    distributeComments(comments_cache.get(prof_id));
                }
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: "Failed to delete comment. Please try again."
                })
            }
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: "Error while deleting comment. Please try again."
            })  
        }
    }

    return (
        <div className="comment-section">
            <h3 className='section-title'>Comments <span className="total-count">( {commentCounts} )</span> </h3>

            {(is_same_college === true || is_same_college === undefined) && <form action="" onSubmit={handleCommentSubmit}>
                <fieldset disabled={postingComment}>
                    <div className="comment-input">
                        <input type="text" defaultValue={editCommentText} ref={commentInputRef} placeholder={`Add a ${selectedComment ? "reply" : "comment"}`} minLength={1} maxLength={300} name="comment" required onFocus={() => {
                            if (!user_details_cache.get('user_id')) {
                                showAuthenticationWindow();
                            }
                        }}
                        onChange={(e) => {
                            if (e.target.value) setCommentBtnDisabled(false);
                            else setCommentBtnDisabled(true);
                        }} />
                        {!postingComment && <> 
                            {editCommentId?.comment_id && 
                                <button className='btn-cancel' type='button' onClick={() => {setEditCommentId({comment_id: null, parent_id: null}); setEditCommentText('');}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            }
                            <button className={`btn-submit ${!commentBtnDisabled && 'active '}`} type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cursor-fill" viewBox="0 0 16 16">
                                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
                                </svg>
                            </button>
                        </>}
                        {postingComment && <Spinner scale={0.5} thickness={2} />}
                    </div>
                    <p className="error-label">{inputError}</p>
                </fieldset>
            </form>}

            {!selectedComment &&
                <>
                    {userComments && userComments.length > 0 && <div className="user-comments">
                        <p className="title">Your Comment(s)</p>
                        {userComments.map((comment) => {
                            return <CommentUI key={comment.comment_id} {...comment}
                                        openReply={openReply}
                                        showAuthenticationWindow={showAuthenticationWindow}
                                        openCommentEdit={openCommentEditing}
                                        deleteComment={deleteComment} />
                        })}
                    </div>}
                    <div className="comment-list">
                        {commentList.map((comment) => {
                            return <CommentUI key={comment.comment_id} {...comment}
                                        openReply={openReply}
                                        showAuthenticationWindow={showAuthenticationWindow}
                                        is_same_college={is_same_college}
                                        prof_id={prof_id} />
                        })}
                    </div>
                </>
            }
            {selectedComment && <div className="comment-reply">
                <div className="back-btn" onClick={() => setSelectedComment(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    <span className="text">Back</span>
                </div>
                {commentList.map((comment) => {
                    if (comment.comment_id === selectedComment) {
                        return <CommentUI key={comment.comment_id} {...comment}
                                    showAuthenticationWindow={showAuthenticationWindow}
                                    is_same_college={is_same_college}
                                    prof_id={prof_id} />
                    }
                })}
                {userComments.map((comment) => {
                    if (comment.comment_id === selectedComment) {
                        return <CommentUI key={comment.comment_id} {...comment}
                                    showAuthenticationWindow={showAuthenticationWindow}
                                    is_same_college={is_same_college}
                                    prof_id={prof_id}
                                    openCommentEdit={openCommentEditing}
                                    deleteComment={deleteComment} />
                    }
                })}

                <div className="reply-list">
                    {replyList.map((comment) => {
                        return <CommentUI key={comment.comment_id} {...comment}
                                    showAuthenticationWindow={showAuthenticationWindow}
                                    is_same_college={is_same_college}
                                    prof_id={prof_id}
                                    openCommentEdit={openCommentEditing}
                                    deleteComment={deleteComment} />
                    })}
                </div>
            </div>}
        </div>
    )
}