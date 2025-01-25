import './style.scss'
import PropTypes from 'prop-types';

RatingStars.propTypes = {
    rating: PropTypes.number.isRequired
}
export default function RatingStars({ rating }) {
    const integer = Math.floor(rating);
    const fraction = Math.round((rating - integer) * 10);

    // converting rating into an array
    // e.g. rating = 3.7 => [10, 10, 10, 7, 0]
    const ratingStars = new Array(5).fill(0).map((_, i) => {
        if (i < integer) {
            return 10;
        }
        if (i === integer) {
            return fraction;
        }
        return 0;
    });

    return (
        <div className="stars">
            {ratingStars.map((value, index) => (
                <Star key={index} value={value} />
            ))}
        </div>
    )
}

Star.propTypes = {
    value: PropTypes.number
}
function Star({ value }) {
    switch (value) {
        case 0:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M49.5528 2L60.7785 36.5491H97.1057L67.7164 57.9017L78.9421 92.4509L49.5528 71.0983L20.1636 92.4509L31.3893 57.9017L2 36.5491H38.3271L49.5528 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 1:
            return (
                <svg width="100" height="95" className='star' viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19 35.5491V47.5755L2.44717 35.5491H19Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 2:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M28 35.5491H2.44717L28 54.1144V35.5491ZM28 68.709V86.0822L20.6107 91.4509L28 68.709Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 3:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M37 35.5491V79.5434L20.6107 91.4509L31.8364 56.9017L2.44717 35.5491H37Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 4:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M45 16.3884V73.731L20.6107 91.4509L31.8364 56.9017L2.44717 35.5491H38.7743L45 16.3884Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 5:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M50 1L38.7743 35.5491H2.44717L31.8364 56.9017L20.6107 91.4509L50 70.0983V1Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 6:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M55 73.731L50 70.0983L20.6107 91.4509L31.8364 56.9017L2.44717 35.5491H38.7743L50 1L55 16.3884V73.731Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1636 57.9017L79.3893 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44717 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 7:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M65 80.9964L50 70.0983L20.6107 91.4509L31.8364 56.9017L2.44714 35.5491H38.7743L50 1L61.2257 35.5491H65V80.9964Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1635 57.9017L79.3892 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44714 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 8:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M71 85.3557L50 70.0983L20.6107 91.4509L31.8364 56.9017L2.44714 35.5491H38.7743L50 1L61.2257 35.5491H71V54.8409L68.1636 56.9017L71 65.6313V85.3557Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1635 57.9017L79.3892 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44714 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 9:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M80 48.302L68.1636 56.9017L79.3893 91.4509L50 70.0983L20.6107 91.4509L31.8364 56.9017L2.44714 35.5491H38.7743L50 1L61.2257 35.5491H80V48.302Z" fill="#52A852" />
                    <path d="M50 2L61.2257 36.5491H97.5528L68.1635 57.9017L79.3892 92.4509L50 71.0983L20.6107 92.4509L31.8364 57.9017L2.44714 36.5491H38.7743L50 2Z" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
        case 10:
            return (
                <svg width="100" height="95" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M49.5528 2L60.7785 36.5491H97.1057L67.7164 57.9017L78.9421 92.4509L49.5528 71.0983L20.1636 92.4509L31.3893 57.9017L2 36.5491H38.3271L49.5528 2Z" fill="#52A852" stroke="#52A852" strokeWidth="4" strokeLinejoin="round" />
                </svg>
            )
    }
}
