import './style.scss'
import { SearchBox, CollegeCard } from '../../components'

export default function CollegesPage() {
    return (
        <div className="colleges-page">
            <h3 className='page-heading'>Look for your college</h3>
            <div className='search-box-cont'><SearchBox /></div>
            <div className="list-container">
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
                <CollegeCard name="University of Edinburgh" img="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/University_of_Edinburgh_Logo.svg/1200px-University_of_Edinburgh_Logo.svg.png" />
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
                <CollegeCard name="University of Edinburgh" img="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/University_of_Edinburgh_Logo.svg/1200px-University_of_Edinburgh_Logo.svg.png" />
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
                <CollegeCard name="University of Edinburgh" img="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/University_of_Edinburgh_Logo.svg/1200px-University_of_Edinburgh_Logo.svg.png" />
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
                <CollegeCard name="University of Edinburgh" img="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/University_of_Edinburgh_Logo.svg/1200px-University_of_Edinburgh_Logo.svg.png" />
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
                <CollegeCard name="University of Edinburgh" img="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/University_of_Edinburgh_Logo.svg/1200px-University_of_Edinburgh_Logo.svg.png" />
                <CollegeCard name="University of Oxford" img="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png" />
                <CollegeCard name="University of Cambridge" img="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Cambridge_University_Logo.svg/1200px-Cambridge_University_Logo.svg.png" />
            </div>
        </div>
    )
}