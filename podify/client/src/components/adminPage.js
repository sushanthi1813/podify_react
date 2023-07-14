import React, {useState} from "react";
import {auth} from "../Firebase.js";
import {useNavigate} from "react-router-dom";
import {FaRegCopyright} from "react-icons/fa";
import Axios from "axios"
import {toast} from "react-toastify";
export default function AdminPage(){

    const navigate = useNavigate();

    // React.useEffect(() => {
    //     if(auth.currentUser === null){
    //         navigate('/')
    //     }
    // },[])

    
    const [formData,setFormData] = useState({
        embedLink: "",
        title: "",
        description: "",
        artist: "",
        genre: "",
        coverImage: ""
    })

    function handleInsert(){
    
        if(formData.embedLink.trim() === '' || formData.title.trim() === "" || formData.description.trim() === "" || formData.artist.trim() === "" || formData.genre.trim() === "" || formData.coverImage.trim() === ""){
            toast.error("Please fill all the fields");
            return;
        }

        Axios.post('http://localhost:3001/api/insert/',
        {
            embedLink: formData.embedLink,
            title: formData.title,
            description: formData.description,
            artist: formData.artist,
            genre: formData.genre,
            coverImage: formData.coverImage
        }).then((response) => {
            if (response.status === 200) {
                toast.success("Successfully added to database");
            } else {
                toast.error("Internal server error")
            }
        })
        .catch((error) => {
            toast.error("Internal server error")
        });

        
    }
    
    function handleFormChange(event){
        const {name,value} = event.target;
        setFormData(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })

        console.log(formData);
    }

    return(
        <div className = "main-section">
            <div className = "side-bar"> 

                <div className="profile-section">
                    <div className="profile"></div>
                    <h1>Welcome Back, {'admin'}</h1>   
                </div>    

                <div className="side-content">
                    <div className="options">Option 1</div>    
                    <div className="options">Option 2</div>    
                    <div className="options">Option 3</div>    
                    <div className="options">Option 4</div>    
                    <div className="options">Option 5</div>    
                </div>    

                <div className="side-footer">
                    <FaRegCopyright size={22}/>
                    <p>Bugs</p>
                </div>

            </div>
            <div className="main-page">
                <div className="form">
                    
                    <textarea onChange={handleFormChange} value={formData.embedLink} name='embedLink' placeholder="Insert embed link" className="embed-input"  cols="83" rows="13"></textarea>
                    
                    <div className="inner-form">
                        <div className="name-inputs-1">
                            <input onChange={handleFormChange} value={formData.title} name = 'title' placeholder="Enter title" className='tags-input' type="text" />
                            <textarea onChange={handleFormChange} value={formData.description} name = 'description' placeholder="Give description about the podcast"  cols="55" rows="6"></textarea>
                        </div>
                        <div className="name-inputs-2">
                            <input  onChange={handleFormChange} value={formData.artist} name='artist' placeholder="Enter artist" className='artist-input' type="text" />
                            <input  onChange={handleFormChange} value={formData.coverImage} name='coverImage' placeholder="Insert Cover Image Link " className='artist-input' type="text" />
                            
                            <select onChange={handleFormChange} value={formData.genre} name="genre" id="">
                                <option value="">Select Genre</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Horror">Horror</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Romance">Romance</option>
                                <option value="Drama">Drama</option>
                                <option value="Action">Action</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Sci">Sci-Fi</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Crime">Crime</option>
                                <option value="Documentary">Documentary</option>
                                <option value="Biography">Biography</option>
                                <option value="History">History</option>
                                <option value="Musical">Musical</option>
                                <option value="Family">Family</option>
                                <option value="Sport">Sport</option>
                                <option value="Music">Music</option>
                                <option value="News">News</option>
                                <option value="Reality-TV">Reality-TV</option>
                                <option value="Talk-Show">Talk-Show</option>
                                <option value="Game-Show">Game-Show</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Health">Health</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Technology">Technology</option>
                                <option value="Science">Science</option>
                                <option value="Nature">Nature</option>
                                <option value="Business">Business</option>
                            </select>
                            <button onClick={handleInsert}>Add Podcast</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}