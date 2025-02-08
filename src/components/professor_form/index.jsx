import { useEffect, useRef, useState } from 'react';
import './style.scss'
import PropTypes from 'prop-types'
import useCustomDialog from '../../custom/dialogs';
import { user_details_cache } from '../../utils/cache';
import { Jimp } from 'jimp';
import { Spinner } from '../../custom/loading_animations';

ProfessorForm.propTypes = {
    closeForm: PropTypes.func
}
export default function ProfessorForm({ closeForm }) {
    const customDialogs = useCustomDialog();
    const image_drop_box_ref = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ type: null, message: null });
    const [userCollegeDetails, setUserCollegeDetails] = useState({ college_name: "Loading...", college_departments: [] });
    const [descriptionLength, setDescriptionLength] = useState(0);

    function setUpForm() {
        // setting college name
        const college_name = user_details_cache.get('college_name');
        const college_departments = user_details_cache.get('college_departments');
        setUserCollegeDetails({ college_name, college_departments });
    }

    useEffect(() => {
        (async () => {
            try {
                if (user_details_cache.has('college_id')) {
                    setUpForm();
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-user-college`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const college_details = await response.json();
                    user_details_cache.set('college_id', college_details.college_id);
                    user_details_cache.set('college_name', college_details.college_name);
                    user_details_cache.set('college_departments', college_details.college_departments);
                    setUpForm();
                }
            } catch (error) {
                console.error(error);
            }
        })()
    }, []);

    function handleFile(file) {
        if (!file) return;
        // checking if file is an png/jpg/jpeg file
        const acceptedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!acceptedImageTypes.includes(file.type)) {
            customDialogs({
                type: 'alert',
                description: 'Please select a png/jpg/jpeg image file.'
            })
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            customDialogs({
                type: 'alert',
                description: 'Please select an image file less than 5MB.'
            })
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (event) => {
            const maxWidth = 300; // Set the maximum width for the image
            const maxHeight = 300; // Set the maximum height for the image
            try {
                const image = await Jimp.read(event.target.result);

                // Calculate the aspect ratio of the image
                const imageAspectRatio = image.bitmap.width / image.bitmap.height;

                // Calculate the target aspect ratio
                const targetAspectRatio = maxWidth / maxHeight;

                // Determine the scaling factor based on aspect ratios
                let scaleFactor;
                if (imageAspectRatio > targetAspectRatio) {
                    // Image is wider than the target aspect ratio
                    scaleFactor = maxWidth / image.bitmap.width;
                } else {
                    // Image is taller than the target aspect ratio
                    scaleFactor = maxHeight / image.bitmap.height;
                }

                // Resize the image while maintaining aspect ratio
                await image.resize({w: Math.round(image.bitmap.width * scaleFactor), h: Math.round(image.bitmap.height * scaleFactor)});

                // reading image as base64
                const base64Image = await image.getBase64('image/jpeg');

                setSelectedImage(base64Image);
            } catch (error) {
                console.error(error);
            }
        };
        reader.onerror = (error) => {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: 'An error occurred while reading the image file.'
            })
        };


    }
    // image drag and drop implementation
    useEffect(() => {
        const dropArea = image_drop_box_ref.current;

        const handleDragOver = (event) => {
            event.preventDefault();
            dropArea.classList.add('drag-over');
        };

        const handleDragLeave = () => {
            dropArea.classList.remove('drag-over');
        };

        const handleDrop = (event) => {
            event.preventDefault();
            dropArea.classList.remove('drag-over');

            const file = event.dataTransfer.files[0];
            handleFile(file);
        };

        const handleClick = () => {
            if (!fileInput) {
                fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    handleFile(file);
                });
            }
            fileInput.click();
        };

        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('dragleave', handleDragLeave);
        dropArea.addEventListener('drop', handleDrop);

        let fileInput = null;
        dropArea.addEventListener('click', handleClick);

        return () => {
            dropArea.removeEventListener('dragover', handleDragOver);
            dropArea.removeEventListener('dragleave', handleDragLeave);
            dropArea.removeEventListener('drop', handleDrop);
            dropArea.removeEventListener('click', handleClick);
        };
    }, [])

    function handleDescriptionChange(e) {
        const description = e.target.value;
        setDescriptionLength(description.length);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const first_name = event.target[1].value.trim();
        const last_name = event.target[2].value.trim() || null;
        const description = event.target[3].value.trim() || null;
        const department = event.target[4].value;

        const payload = { first_name, department };

        if (last_name) payload.last_name = last_name;
        if (description) payload.description = description;
        if (selectedImage) payload.image = selectedImage;

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submit-professor-form`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                setLoading(false);
                await customDialogs({
                    type: 'alert',
                    description: 'Successfully submitted the form.'
                })
                closeForm(true);
            }
            else {
                const response_type = (response.headers.get("Content-Type")).includes("application/json") ? "json" : "text";
                const error = response_type === "json" ? await response.json() : await response.text();
                const error_type = response_type === "json" && error.type ? error.type : "server";
                let error_msg = response_type === "json" && error.message ? error.message : error;
                if (error_msg.length > 100) error_msg = "Something went wrong. Please try again later.";
                setError({ type: error_type, message: error_msg });
                setLoading(false);
            }
        }
        catch (error) {
            console.error(error);
            setError({
                type: 'server',
                message: 'Something went wrong. Please try again later.'
            });
            setLoading(false);
        }
    }

    return (
        <div className="professor-form-container" onClick={() => closeForm(false)}>
            <div className="content-container" onClick={(e) => e.stopPropagation()}>
                <h3 className='form-heading'>Add Professor</h3>
                <p className="form-description">
                    Your input is greatly appreciated and helps us build a more comprehensive and engaging resource
                </p>
                <div className="note">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                    </svg>
                    <p className='note-text'>You can add Professors of your college only</p>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <fieldset disabled={loading}>
                        <div className="input-field full-name">
                            <p className="field-title">Full Name</p>
                            <div className="input-container left-right">
                                <div className="input-box">
                                    {error.type === "first_name" && <p className="error-msg-cont">{error.message}</p>}
                                    <AlphabeticalInput name="first-name" id="first-name" pattern="^[a-zA-Z]+$" title="Only Alphabets are allowed" maxLength="20" required />
                                    <label htmlFor="first-name">First Name</label>
                                </div>
                                <div className="input-box">
                                    {error.type === "last_name" && <p className="error-msg-cont">{error.message}</p>}
                                    <AlphabeticalInput name="last-name" id="last-name" pattern="^[a-zA-Z]+$" title="Only Alphabets are allowed" maxLength="20" />
                                    <label htmlFor="last-name">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="input-field description">
                            <p className="field-title">Description</p>
                            <div className="input-container input-box">
                                {error.type === "description" && <p className="error-msg-cont">{error.message}</p>}
                                <textarea name="description" id="description" maxLength="300" onChange={handleDescriptionChange} />
                                <label htmlFor="description">{descriptionLength} / 300</label>
                            </div>
                        </div>
                        <div className="input-field department">
                            <p className="field-title">Department</p>
                            <div className="input-container left-right">
                                <div className="input-box">
                                    {error.type === "department" && <p className="error-msg-cont">{error.message}</p>}
                                    <input type="text" name="department" id="department" list="department-list" maxLength="60" required />
                                    <datalist id="department-list">
                                        {userCollegeDetails.college_departments.map((department, index) => <option key={index} value={department} />)}
                                    </datalist>
                                    <label htmlFor="department">Professor&apos;s Department</label>
                                </div>
                                <div className="input-box college-name-container">
                                    <input id="college-name" value={userCollegeDetails.college_name} readOnly />
                                    <label htmlFor="college-name">College Name</label>
                                </div>
                            </div>
                        </div>
                        <div className='image-input'>
                            <p className="field-title">Image</p>
                            <div className="left-right">
                                <div className="image-drop-box" style={{ display: loading ? "none" : "flex" }} ref={image_drop_box_ref}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="upload-icon" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />
                                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                                    </svg>
                                    <p className="upload-text">Drag & Drop an Image Here or Click to Upload</p>
                                </div>
                                <div className="preview">
                                    {!selectedImage && <p className="preview-text">Preview</p>}
                                    {selectedImage && <img src={selectedImage} alt="" />}
                                    {!loading && <div className="delete-btn" onClick={() => setSelectedImage(null)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {error.type &&
                            (error.type !== "first_name" || error.type !== "last_name" || error.type !== "description" || error.type !== "department") &&
                            <p className="error-msg-cont bottom">{error.message}</p>
                        }
                        <hr />
                        <div className="submit-btn-cont">
                            {!loading && <button type="submit">Submit</button>}
                            {loading && <Spinner scale={0.5} thickness={2} color="#31a754" />}
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

function AlphabeticalInput(props) {
    return (
        <input type="text" {...props} onInput={(event) => {
            event.target.value = event.target.value.replace(/[^a-zA-Z]+/gi, '');
        }} />
    )
}