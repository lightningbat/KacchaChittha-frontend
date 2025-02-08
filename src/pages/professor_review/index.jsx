import './style.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCustomDialog from '../../custom/dialogs'
import { professors_review_cache } from '../../utils/cache'
import PropTypes from 'prop-types'
import { CustomProgressBar, UserReviewWrite, UserReviewDisplay, UserReviewEdit, CommentSection } from './local_components'

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

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-professor/${prof_id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
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
                        overall_rating: Number(overallRating.toFixed(1)),
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
                }
                else {
                    customDialogs({
                        type: 'alert',
                        description: 'Failed to fetch professor data.'
                    })
                }
            } catch (error) {
                console.error(error);
                customDialogs({
                    type: 'alert',
                    description: 'An error occurred while fetching professor data.'
                })
            }
        })()
    }, [])

    // managing which review box to show (post / display) after data fetched
    useEffect(() => {
        if (!userReview?.user_id || (userReview?.is_same_college && !userReview?.review)) {
            setReviewBoxToShow('write');
        }
        else if (userReview?.review) {
            setReviewBoxToShow('display');
        }
    }, [userReview])

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
                <UserReviewWrite
                    currentRating={currentRating}
                    setCurrentRating={setCurrentRating}
                    showAuthenticationWindow={showAuthenticationWindow}
                    prof_id={prof_id}
                    setUserReview={setUserReview}
                    setReviewBoxToShow={setReviewBoxToShow}
                />
            }
            {reviewBoxToShow === 'display' &&
                <UserReviewDisplay
                    userReview={userReview}
                    setUserReview={setUserReview}
                    setReviewBoxToShow={setReviewBoxToShow}
                    setCurrentRating={setCurrentRating}
                    showAuthenticationWindow={showAuthenticationWindow}
                    prof_id={prof_id}
                />
            }
            {reviewBoxToShow === 'edit' &&
                <UserReviewEdit
                    currentRating={currentRating}
                    setCurrentRating={setCurrentRating}
                    setReviewBoxToShow={setReviewBoxToShow}
                    userReview={userReview}
                    setUserReview={setUserReview}
                    showAuthenticationWindow={showAuthenticationWindow}
                    prof_id={prof_id}
                />
            }

            <CommentSection
                is_same_college={userReview?.is_same_college}
                showAuthenticationWindow={showAuthenticationWindow}
                prof_id={prof_id} />
        </div>
    )
}