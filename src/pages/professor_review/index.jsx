import { useEffect, useRef, useState } from 'react'
import './style.scss'
import { useParams } from 'react-router-dom'
import { OutsideClickDetector } from '../../components'
import useCustomDialog from '../../custom/dialogs'
import { user_details_cache, professors_review_cache } from '../../utils/cache'
import PropTypes from 'prop-types'

ProfessorReviewPage.propTypes = {
    showAuthenticationWindow: PropTypes.func
}
export default function ProfessorReviewPage({ showAuthenticationWindow }) {
    const customDialogs = useCustomDialog();
    const { id: prof_id } = useParams();
    const [details, setDetails] = useState(); // professor details
    const [review, setReview] = useState(); // professor review, Format {total_ratings, overall_rating, distributed_ratings}
    const [userReview, setUserReview] = useState(null); // current user review (if has reviewed this professor)
    const [currentRating, setCurrentRating] = useState(0); // to manage rating stars state
    const [reviewBoxToShow, setReviewBoxToShow] = useState(null); // to manage review box state (write / display)
    const posted_review_menubtn_ref = useRef(null);
    const [showPostedReviewMenu, setShowPostedReviewMenu] = useState(false);
    const [updatingReview, setUpdatingReview] = useState(false); // disable rating box while posting/editing review

    const fetchWrapper = async (url, options, err_msg) => {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                message: err_msg || 'Something went wrong. Please try again later.'
            })
            return null;
        }
    }

    // fetching professor and review data
    useEffect(() => {
        (async () => {
            // loading data from cache (if available)
            if (professors_review_cache.has(prof_id)) {
                const data = professors_review_cache.get(prof_id);
                setDetails(data.details);
                setReview(data.review);
                setUserReview(data.user_review);
                return;
            }

            const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/get-professor/${prof_id}`, {
                method: 'GET',
                credentials: 'include'
            },
                "An error occurred while fetching professor details"
            );
            if (response && response.status === 200) {
                const data = await response.json();

                // calculating overall rating and total ratings count
                const totalRatings = Object.values(data.distributed_ratings).reduce((total, value) => total + value, 0);
                const overallRating = Object.entries(data.distributed_ratings).reduce((total, [key, value]) => total + parseFloat(key) * value, 0) / totalRatings;

                // organizing data
                const prof_details = {
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image,
                    description: data.description,
                    department: data.department,
                    college_name: data.college_name,
                    college_id: data.college_id
                }
                const prof_reviews = {
                    total_ratings: totalRatings,
                    overall_rating: overallRating.toFixed(1),
                    distributed_ratings: data.distributed_ratings
                }
                const user_review = data.user ? {
                    user_id: data.user.user_id,
                    is_same_college: data.user.is_same_college,
                    review: data.user.review
                } : null

                // setting state
                setDetails(prof_details)
                setReview(prof_reviews)
                setUserReview(user_review)

                // storing data in cache
                professors_review_cache.set(prof_id, {
                    details: prof_details,
                    review: prof_reviews,
                    user_review: user_review
                });

                console.log(professors_review_cache.get(prof_id));
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: 'Failed to fetch professor data.'
                })
            }
        })()
    }, [])

    // managing which review box to show (post / display) after data fetched
    useEffect(() => {
        if (!userReview) return;
        if (userReview?.review) {
            setReviewBoxToShow('display');
        }
        else if (!userReview?.user_id || (userReview?.is_same_college && !userReview?.review)) {
            setReviewBoxToShow('write');
        }
    }, [userReview])

    // manage client side rating stars state
    function handleRatingChange(rating) {
        if (updatingReview) return;
        if (rating === currentRating) {
            setCurrentRating(0);
        } else {
            setCurrentRating(rating);
        }
    }


    async function handlePostReview() {
        const user_id = user_details_cache.get('user_id');
        if (!user_id) {
            showAuthenticationWindow();
            return;
        }
        if (!currentRating) return;

        setUpdatingReview(true);

        const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/post-rating`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prof_id, rating: currentRating })
        }, "An error occurred while posting review.");

        if (response && response.status === 201) {
            const { timestamp } = await response.json();

            // updating cache
            professors_review_cache.get(prof_id).user_review = {
                user_id,
                is_same_college: true,
                review: { rating: currentRating, timestamp }
            }

            // updating state
            setUserReview({
                user_id,
                is_same_college: true,
                review: { rating: currentRating, timestamp }
            })
            setReviewBoxToShow('display');

            console.log(professors_review_cache.get(prof_id));

            setUpdatingReview(false); // enabling rating box to make it editable
        }
        else {
            customDialogs({
                type: 'alert',
                description: 'Failed to post review.'
            })

            setUpdatingReview(false);
        }
    }

    async function deleteReview() {
        const user_confirm = await customDialogs({
            type: 'confirm',
            title: 'Delete Review?',
            description: 'Are you sure you want to delete your review?'
        })

        if (user_confirm) {
            customDialogs({
                type: 'alert',
                description: 'Review deleted successfully.'
            })
        }
    }

    return (
        <div className="professor-review-page">
            <div className="main-content">
                <div className="prof-details">
                    <div className="image">
                        <img src={details?.image} alt="" />
                    </div>
                    <div className="info">
                        <h3 className="name">{details?.name}</h3>
                        <p className="college">{details?.college_name}</p>
                        <p className="department">{details?.department}</p>
                        <p className="description">{details?.description}</p>
                    </div>
                </div>
                {review && review.total_ratings > 0 &&
                    <div className="reviews">
                        <div className="overall-rating">
                            <p className="rating-container"><span className="rating">{review?.overall_rating}</span><span className="slash">/&nbsp;&nbsp; 5</span></p>
                            <p className="rating-description">Overall rating on {review?.total_ratings} review(s)</p>
                        </div>
                        <div className="distributed-rating">
                            <p className="title">Rating Distribution</p>
                            <div className="left-right">
                                <span className='label-title'>5</span>
                                <CustomProgressBar value={review?.distributed_ratings["5"] / review?.total_ratings * 100} />
                                <span className='count'>{review?.distributed_ratings["5"]}</span>
                            </div>
                            <div className="left-right">
                                <span className='label-title'>4</span>
                                <CustomProgressBar value={review?.distributed_ratings["4"] / review?.total_ratings * 100} />
                                <span className='count'>{review?.distributed_ratings["4"]}</span>
                            </div>
                            <div className="left-right">
                                <span className='label-title'>3</span>
                                <CustomProgressBar value={review?.distributed_ratings["3"] / review?.total_ratings * 100} />
                                <span className='count'>{review?.distributed_ratings["3"]}</span>
                            </div>
                            <div className="left-right">
                                <span className='label-title'>2</span>
                                <CustomProgressBar value={review?.distributed_ratings["2"] / review?.total_ratings * 100} />
                                <span className='count'>{review?.distributed_ratings["2"]}</span>
                            </div>
                            <div className="left-right">
                                <span className='label-title'>1</span>
                                <CustomProgressBar value={review?.distributed_ratings["1"] / review?.total_ratings * 100} />
                                <span className='count'>{review?.distributed_ratings["1"]}</span>
                            </div>
                        </div>
                    </div>
                }
                {review && review.total_ratings === 0 &&
                    <div className="no-review-yet">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                        </svg>
                        <p>No Review yet</p>
                    </div>
                }
            </div>
            {/* showing write box only if :- 
                1. user is not logged in
                2. user is from same college and has not posted a review
            */}
            {reviewBoxToShow === 'write' &&
                <div className="user-review un-posted">
                    <h5>Help your fellow juniors know more about their professor</h5>
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
                        <button disabled={updatingReview} className={`post ${currentRating ? "active" : ""}`} onClick={handlePostReview}>Post</button>
                    </div>
                </div>
            }

            {reviewBoxToShow === 'display' &&
                <div className="user-review posted">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="popup-btn" onClick={() => setShowPostedReviewMenu(!showPostedReviewMenu)} ref={posted_review_menubtn_ref} viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                            {showPostedReviewMenu && <OutsideClickDetector style={{ position: 'absolute', top: '3rem', right: '1rem' }} closePopup={() => setShowPostedReviewMenu(false)} buttonRef={posted_review_menubtn_ref} >
                                <div className="popup-menu">
                                    <button className="edit" onClick={() => { setReviewBoxToShow('edit'); setShowPostedReviewMenu(false); setCurrentRating(userReview?.review?.rating); }}>Edit</button>
                                    <button className="delete" onClick={deleteReview}>Delete</button>
                                </div>
                            </OutsideClickDetector>}
                        </div>
                    </div>
                </div>
            }

            {reviewBoxToShow === 'edit' &&
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
                            <button disabled={updatingReview} className="cancel" onClick={() => setReviewBoxToShow('display')}>Cancel</button>
                            <button disabled={updatingReview} className={`save ${currentRating !== userReview?.review?.rating && currentRating !== 0 ? 'active' : ''}`}>Save</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}


// eslint-disable-next-line react/prop-types
function CustomProgressBar({ value }) {
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
        </div>
    )
}