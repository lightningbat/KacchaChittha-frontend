import './style.scss';
import prof_snape from '../../assets/media/prof_snape.png';
import { CollegeCard, ProfessorCard } from '../../components';
import { useState, useEffect } from 'react';
import spidey from '../../assets/media/spidey.png';
import { useNavigate } from 'react-router-dom';
import { top_lists_cache } from '../../utils/cache';

export default function HomePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("colleges");
    const [topList, setTopList] = useState({
        colleges: [],
        professors: []
    });

    const updateActiveTab = (tab) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        (async () => {
            if (top_lists_cache.has("colleges") && top_lists_cache.has("professors")) {
                setTopList({colleges: top_lists_cache.get("colleges"), professors: top_lists_cache.get("professors")});
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-top-lists`);
                if (response.ok) {
                    const data = await response.json();
                    // 
                    setTopList({colleges: data.TopColleges, professors: data.TopProfessors});
                    top_lists_cache.set("colleges", data.TopColleges);
                    top_lists_cache.set("professors", data.TopProfessors);
                }
            } catch (error) {
                console.error(error);
            }
        })()
    }, [])

    return (
        <div className="home-page">
            <section className='hero-section'>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Kaccha Chittha</h1>
                        <p>Let&apos;s rate those who rate us</p>
                    </div>
                    <img className='hero-img' src={prof_snape} alt="" />
                </div>
                <div className="hero-content-mobile-view">
                    <h1>Kaccha Chittha</h1>
                    <div className="flex-container">
                        <p>Let&apos;s rate those who rate us</p>
                        <img className='hero-img' src={prof_snape} alt="" />
                    </div>
                </div>
            </section>
            <section className='featured-section'>
                <h2 className="section-title">Trending</h2>
                <div className="featured-tabs">
                    <div className="featured-tab-btns no-select">
                        <div className={`button ${activeTab === "colleges" && "active"}`} onClick={() => updateActiveTab("colleges")}>
                            <p>Colleges</p>
                            <div className="active-border"></div>
                        </div>
                        <div className={`button ${activeTab === "professors" && "active"}`} onClick={() => updateActiveTab("professors")}>
                            <p>Professors</p>
                            <div className="active-border"></div>
                        </div>
                    </div>
                    <div className="featured-tab-content">
                        {activeTab === "colleges" && <>
                            {topList.colleges.map(college => <CollegeCard key={college.id} {...college} onClick={() => navigate(`/college/${college.id}/departments`)} />)}
                        </>}
                        {activeTab === "professors" && <>
                            {topList.professors.map(professor => <ProfessorCard key={professor.prof_id} {...professor} onClick={() => navigate(`/professor/${professor.prof_id}`)} />)}
                        </>}
                    </div>

                </div>
            </section>
            <div className="footer-msg">
                <img src={spidey} alt="" />
                <p>© 2025 Kaccha Chittha</p>
            </div>
        </div>
    );
}