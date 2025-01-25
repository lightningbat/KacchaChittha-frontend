import './style.scss';
import PropTypes from 'prop-types';
import RatingStars from './rating_stars';

ProfessorCard.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    college: PropTypes.string,
    rating: PropTypes.number
}
export default function ProfessorCard({ img, name, college, rating=0.5 }) {

    // Styling background image
    const clrs = ["rgb(204, 235, 233)", "rgb(204, 235, 206)", "rgb(204, 223, 235)", "rgb(235, 204, 234)", "rgb(235, 204, 204)"];
    const random_clr = clrs[Math.floor(Math.random() * clrs.length)];
    const background_image = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${random_clr}" className="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>')`;

    return (
        <div className="professor-card-global" style={{ backgroundImage: background_image }}>
            <div className="img-container">
                {img && <img src={img} alt="" />}
            </div>
            <h3 className='name'>{name ? name : "Professor Name"}</h3>
            { college && <p className='college-name'>{college}</p>}
            <div className="rating">{rating}
                <RatingStars rating={rating} />
            </div>
        </div>
    )
}