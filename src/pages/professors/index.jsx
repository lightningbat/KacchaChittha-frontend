import { SearchBox, ProfessorCard } from '../../components'
import './style.scss'
// import { useParams } from 'react-router-dom'

export default function ProfessorsPage() {
    // const { id } = useParams();
    return (
        <div className="professor-page">
            <h3 className='page-heading'>Know Your Professors</h3>
            <div className='search-box-cont'><SearchBox /></div>
            <div className="list-container">
                <ProfessorCard />
                <ProfessorCard />
                <ProfessorCard />
                <ProfessorCard />
                <ProfessorCard />
                <ProfessorCard />
            </div>
        </div>
    )
}