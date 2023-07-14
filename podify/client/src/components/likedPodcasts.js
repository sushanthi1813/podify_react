import React from "react";
import {BiLogOut} from "react-icons/bi";
import Axios from 'axios';
import Spinner from '../loader.svg'
import { nanoid } from "nanoid";
import {FaHeadphones} from "react-icons/fa";

export default function LikedPodcasts(props){
    const likedPodsList = props.likedList;
    const [fetching,setFetching] = React.useState(true)
    const [podcasts,setpodcasts] = React.useState(null)

    React.useEffect(() => {
        if(likedPodsList.length === 0){
            setFetching(false)
            setpodcasts([])
            return;
        }
        
        Axios.get('http://localhost:3001/api/get/', {
            params: {
                ids: likedPodsList.join(',')
            }
            })
            .then((response) => {
                console.log(response.data);
                if(response.data.length === 0){
                    setFetching(false)
                    setpodcasts([])
                    return;
                }
                setpodcasts(response.data)
                setFetching(false)
            })
            .catch((error) => {
                console.error('Error fetching podcasts:', error);
            });
    }, [])

    const truncateDescription = (description) => {
        const maxLines = 7;
        const lineHeight = 20; // Adjust this value based on your font size and line height
        const maxHeight = maxLines * lineHeight;
      
        // Check if the description exceeds the maximum height
        if (description.length > maxHeight) {
          // Truncate the description to the maximum height
          const truncatedText = description.slice(0, maxHeight);
          
          // Find the last complete word before the truncation point
          const lastSpaceIndex = truncatedText.lastIndexOf(' ');
          const truncatedDescription = truncatedText.slice(0, lastSpaceIndex) + '...';
      
          return truncatedDescription;
        }
      
        return description;
      };
      

    return(
        <div>
            <div className="header-part">
                <h1>Liked Podcasts</h1>
                <div className="insert-btn">
                    <BiLogOut className="search-icon" color="white" size={22}/>
                    <button onClick={() => {props.goBack()}}>Back</button>
                </div>
            </div>

            <div className="main-part">
                { 
                    !fetching ?

                        podcasts.length === 0 ?
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80%"}}>
                                <h1>No Liked Podcasts</h1>
                            </div>
                        :
                         <div className = "liked-podcast-container">
                            {podcasts.map((podcast) => {
                                return(
                                        <div key={podcast.ID} className="liked-podcast">
                                            <img className="cover-image" style={{borderRadius:"10px"}} src={podcast.coverImage} alt="" />
                                            
                                            <div className="liked-podcast-info">
                                                <h5>{podcast.title}</h5>
                                                <p> {truncateDescription(podcast.description)}</p>
                                                <div className="liked-button-container">
                                                    <button onClick = {() => {props.setPodcast(podcast); props.setTab('podcast')}}>Listen Now!</button>
                                                    <FaHeadphones color="#1e1e1e" size={22} style={{position:"absolute",top:"8px",left:"51px"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            })}
                         </div>
                    : 
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80%"}}>
                        <img style={{height:'50px'}} src={Spinner} alt="Loading..." />
                    </div>
                }
            </div>
        </div>
    )
}
