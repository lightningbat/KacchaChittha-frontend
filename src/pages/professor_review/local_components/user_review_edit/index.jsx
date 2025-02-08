import './style.scss'
import { user_details_cache, professors_review_cache } from '../../../../utils/cache';
import { useState } from 'react';
import useCustomDialog from '../../../../custom/dialogs';
import { Spinner } from '../../../../custom/loading_animations';
import PropTypes from 'prop-types';

UserReviewEdit.propTypes = {
    currentRating: PropTypes.number,
    setCurrentRating: PropTypes.func,
    setReviewBoxToShow: PropTypes.func,
    userReview: PropTypes.object,
    setUserReview: PropTypes.func,
    showAuthenticationWindow: PropTypes.func,
    prof_id: PropTypes.string
}
export default function UserReviewEdit({currentRating, setCurrentRating, setReviewBoxToShow, userReview, setUserReview, showAuthenticationWindow, prof_id }) {
    const customDialogs = useCustomDialog();
    const [loading, setLoading] = useState(false);

    async function handleEditReview() {
        const user_id = user_details_cache.get('user_id');
        if (!user_id) {
            showAuthenticationWindow();
            return;
        }

        if (!currentRating) return;
        if (currentRating === userReview?.review.rating) return;

        setLoading(true); // disabling rating box while editing review

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/update-rating`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prof_id, rating: currentRating })
            });

            if (response && response.status === 200) {
                const { timestamp } = await response.json();

                // updating cache
                professors_review_cache.get(prof_id).user_review.review.rating = currentRating;
                professors_review_cache.get(prof_id).user_review.review.timestamp = timestamp;
                // updating state
                setUserReview({
                    ...userReview,
                    review: {
                        rating: currentRating,
                        timestamp
                    }
                })
                setReviewBoxToShow('display'); // showing display review box
                setLoading(false); // enabling rating box to make it editable
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: 'Failed to update review.'
                })
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: 'Failed to update review.'
            })
            setLoading(false);
        }
    }

    function handleRatingChange(rating) {
        if (loading) return;
        if (rating === currentRating) {
            setCurrentRating(0);
        } else {
            setCurrentRating(rating);
        }
    }

    return (
        <div className="user-review edit">
            <div className="left-right no-select">
                <div className="rating-stars">
                    {[...Array(5)].map((_, index) => (
                        <div className="star-cont" onClick={() => handleRatingChange(index + 1)} key={index}>
                            {index + 1 <= currentRating ?
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
                <div className="btns-cont">
                    {!loading && <> <button disabled={loading} className="cancel" onClick={() => setReviewBoxToShow('display')}>Cancel</button>
                    <button disabled={loading} onClick={handleEditReview} className={`save ${currentRating !== userReview?.review?.rating && currentRating !== 0 ? 'active' : ''}`}>Save</button> </>}
                    {loading && <Spinner scale={0.5} thickness={2} color="#464646" />}
                </div>
            </div>
        </div>
    )
}