import './style.scss'
import PropTypes from 'prop-types'

CustomProgressBar.propTypes = {
    value: PropTypes.number
}
export default function CustomProgressBar({ value }) {
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
        </div>
    )
}