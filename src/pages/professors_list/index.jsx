import './style.scss'
import { SearchBox, ProfessorCard } from '../../components'
import { useNavigate } from 'react-router-dom';

export default function ProfessorsListPage() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/professor/john-doe');
    };
    return (
        <div className="professor-page">
            <h3 className='page-heading'>Know Your Professors</h3>
            <div className='search-box-cont'><SearchBox /></div>
            <div className="list-container">
                {[...Array(30).keys()].map((item) => (
                    <div className="list-item" key={item} onClick={handleClick}><ProfessorCard /></div>
                ))}
            </div>
        </div>
    )
}