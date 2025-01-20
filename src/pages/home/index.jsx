import './style.scss';
import prof_snape from '../../assets/media/prof_snape.png';
import { SearchBox } from '../../components';
import { CollegeCard, ProfessorCard } from '../../components';

import { useEffect, useState } from 'react';

import footer_img_1 from '../../assets/media/footer_img_1.png';
import footer_img_2 from '../../assets/media/footer_img_2.png';

export default function HomePage() {
    const [activeTab, setActiveTab] = useState("colleges");

    const images = [footer_img_1, footer_img_2];
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length // Cycle through images
            );
        }, 5000); // Change image every 2 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [images.length]);


    const updateActiveTab = (tab) => {
        setActiveTab(tab);
    }
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
                <div style={{ width: "clamp(20rem, 80%, 50rem)" }}><SearchBox /></div>

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
                            <CollegeCard />
                            <CollegeCard />
                            <CollegeCard />
                        </>}
                        {activeTab === "professors" && <>
                            <ProfessorCard key={1} />
                            <ProfessorCard key={2} />
                            <ProfessorCard key={3} />
                        </>}
                    </div>

                </div>
            </section>
            <div className="footer-msg">
                <img src={images[activeImageIndex]} alt="" />
                <p>© 2023 Kaccha Chittha</p>
            </div>
        </div>
    );
}