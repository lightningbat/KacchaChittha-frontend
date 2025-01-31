import './style.scss'
import { OutsideClickDetector } from '../../../../components';
import { useRef, useState } from 'react';
import { user_details_cache, professors_review_cache } from '../../../../utils/cache';
import useCustomDialog from '../../../../custom/dialogs';
import PropTypes from 'prop-types'

UserReviewDisplay.propTypes = {
    userReview: PropTypes.object,
    setUserReview: PropTypes.func,
    setReviewBoxToShow: PropTypes.func,
    setCurrentRating: PropTypes.func,
    showAuthenticationWindow: PropTypes.func,
    prof_id: PropTypes.string
}
export default function UserReviewDisplay({ userReview, setUserReview, setReviewBoxToShow, setCurrentRating, showAuthenticationWindow, prof_id }) {
    const customDialogs = useCustomDialog();
    const menubtn_ref = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    async function deleteReview() {
        setShowMenu(false); // closing menu

        if (!user_details_cache.get('user_id')) {
            showAuthenticationWindow();
            return;
        }
        const user_confirm = await customDialogs({
            type: 'confirm',
            title: 'Delete Review?',
            description: 'Are you sure you want to delete your review?'
        })
        if (!user_confirm) return;

        setLoading(true); // disabling rating box while deleting review

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/delete-rating`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prof_id })
            });

            if (response && response.status === 200) {
                // updating cache
                professors_review_cache.get(prof_id).user_review.review = null;
                // updating state
                setUserReview({ ...userReview, review: null });
                setCurrentRating(0);
                setReviewBoxToShow('write'); // showing write review box
                setLoading(false); // enabling rating box to make it editable
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: 'Failed to delete review.'
                })
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: 'An error occurred while deleting review.'
            })
            setLoading(false); // enabling rating box to make it editable
        }
    }

    return (
        <div className="user-review display">
            <p className="time-display">{new Date(userReview?.review?.timestamp).toLocaleString()}</p>
            <div className="left-right no-select">
                <div className="rating-stars">
                    {[...Array(5)].map((_, index) => (
                        <div className="star-cont" key={index}>
                            {index + 1 <= userReview?.review?.rating ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                </svg>
                            }
                        </div>
                    ))}
                </div>
                <div className="popup">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="popup-btn" onClick={() => setShowMenu(!showMenu)} ref={menubtn_ref} viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                    {showMenu && <OutsideClickDetector style={{ position: 'absolute', top: '3rem', right: '1rem' }} closePopup={() => setShowMenu(false)} buttonRef={menubtn_ref} >
                        <div className="popup-menu">
                            <button disabled={loading} className="edit" onClick={() => { setReviewBoxToShow('edit'); setShowMenu(false); setCurrentRating(userReview?.review?.rating); }}>Edit</button>
                            <button disabled={loading} className="delete" onClick={deleteReview}>Delete</button>
                        </div>
                    </OutsideClickDetector>}
                </div>
            </div>
        </div>
    )
}