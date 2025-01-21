import './style.scss';
import PropTypes from 'prop-types';

CollegeCard.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func
}
export default function CollegeCard({ img, name, onClick }) {
    return (
        <div className="college-card-global" onClick={onClick}>
            <div className="img-container">
                {img && <img className="college-img" src={img} alt="" />}
            </div>
            <h3 className="college-name">{name ? name : "College Name"}</h3>
        </div>
    )
}