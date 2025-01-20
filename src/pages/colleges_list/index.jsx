import './style.scss'
import { SearchBox, CollegeCard } from '../../components'
import { useEffect, useState } from 'react'
import useCustomDialog from '../../custom/dialogs';

let cached_data = [];

export default function CollegesListPage() {
    const customDialogs = useCustomDialog();
    const [collegesList, setCollegesList] = useState([]);

    useEffect(() => {
        console.log(cached_data);
        (async () => {
            if (cached_data.length && !collegesList.length) {
                setCollegesList(cached_data);
                return;
            }
            // getting colleges list from api
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-colleges`, {
                    method: "GET"
                })

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setCollegesList(data);
                    // populating data
                    cached_data = data;
                } else {
                    customDialogs({
                        type: "alert",
                        title: "Error",
                        description: "Failed to get colleges list"
                    });
                    const response_format = response.headers.get("Content-Type").includes("application/json") ? "json" : "text";

                    const error = response_format === "json" ? await response.json() : await response.text();
                    console.error(error);
                }
            }
            catch (error) {
                customDialogs({
                    type: "alert",
                    title: "Error",
                    description: "Error while getting colleges list"
                });
                console.error(error);
            }
        })()
    }, [])
    
    return (
        <div className="colleges-page">
            <h3 className='page-heading'>Look for your college</h3>
            <div className='search-box-cont'><SearchBox /></div>
            <div className="list-container">
                {
                    collegesList.map((item) => (
                        <CollegeCard name={item.name} img={item.img} key={item.id} />
                    ))
                }
            </div>
        </div>
    )
}