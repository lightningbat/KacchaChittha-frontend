import './style.scss';
import PropTypes from 'prop-types';
import RatingStars from './rating_stars';
import { useInView } from 'react-intersection-observer';

ProfessorCard.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    college_name: PropTypes.string,
    department: PropTypes.string,
    designation: PropTypes.string,
    rating: PropTypes.number,
    onClick: PropTypes.func,
    random_color: PropTypes.string
}
/**
 * 
 * @param {Object} props - contains { image, name, college_name, department, designation, rating, onClick, random_color }
 * @returns {JSX.Element}
 */
export default function ProfessorCard({ image, name, college_name, department, designation, rating = 0.5, onClick, random_color }) {

    // Styling background image
    const clrs = ["rgb(204, 235, 233)", "rgb(204, 235, 206)", "rgb(204, 223, 235)", "rgb(235, 204, 234)", "rgb(235, 204, 204)"];
    const random_clr = random_color || clrs[Math.floor(Math.random() * clrs.length)];
    const background_image = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${random_clr}" className="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>')`;
    const { ref, inView } = useInView({
        triggerOnce: true, // Load only once
        rootMargin: '100px 0px', // Load 100px before appearing
    });

    return (
        <div className="professor-card-global" style={{ backgroundImage: background_image }} onClick={onClick}>
            <div className="img-container" ref={ref}>
                {image && inView && <img src={image} alt="" />}
            </div>
            <h3 className='name'>{name ? name : "Professor Name"}</h3>
            {college_name && <p className='college-name'>{college_name}</p>}
            {department && <p className='department'>{department}</p>}
            {designation && <p className='designation'>{designation}</p>}
            <div className="rating">{rating}
                {rating && rating > 0 && <RatingStars rating={rating} />}
                {(!rating || rating === 0) && <p className='no-rating'>No Rating</p>}
            </div>
        </div>
    )
}