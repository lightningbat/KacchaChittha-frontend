import './style.scss';
import PropTypes from 'prop-types';

CollegeCard.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string
}
export default function CollegeCard({ img, name }) {
    return (
        <div className="college-card">
            <div className="img-container">
                {img && <img src={img} alt="" />}
            </div>
            <h3>{name ? name : "College Name"}</h3>
        </div>
    )
}