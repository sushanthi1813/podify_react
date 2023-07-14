import React from "react";
import {auth} from "../Firebase.js";
import {useNavigate} from "react-router-dom";
import {FaRegCopyright} from "react-icons/fa";
import { BiLogOut} from "react-icons/bi";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import Spinner from '../loader.svg'
import { toast } from 'react-toastify';
import { db } from '../Firebase.js';
import { doc,collection, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { HiCursorClick } from "react-icons/hi";
import Axios from "axios";

export default function PodcastPage(props){
    const navigate = useNavigate();
    const [fetching,setFetching] = React.useState(true)
    const [loading,setLoading] = React.useState(true)
    const [liked,setLiked] = React.useState(false)
    React.useEffect(() => {
        if(auth.currentUser === null){
            navigate('/')
        }

        if(props.activePodcast === null){
            navigate('/user')
        }   
    },[])

    React.useEffect(() => {

        const getLikedPodcasts = async () => {
            const userEmail = auth.currentUser ? auth.currentUser.email : null;
            if (userEmail) {
                // Check if the 'users' collection exists, create it if not present
                const usersCollectionRef = collection(db,"users")
                const userDocRef = doc(usersCollectionRef, userEmail);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.likedPodcasts.includes(props.activePodcast.ID)) {
                        setLiked(true);
                    }
                }
            }
        }
        getLikedPodcasts()
    },[props.activePodcast])

    const podcast = props.activePodcast;    

    const handleUnLikePodcast = async (podcastId) => {
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
        if (userEmail) {
            // Check if the 'users' collection exists, create it if not present
            const usersCollectionRef = collection(db,"users")
            const userDocRef = doc(usersCollectionRef, userEmail);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data().likedPodcasts;
                userData.splice(userData.indexOf(podcastId), 1);
                updateDoc(userDocRef, {
                    likedPodcasts: userData,
                })
                    .then(() => {
                        setLiked(prev => !prev)
                        console.log('Podcast ID removed from likedPodcasts array');
                        // Unlike operation completed successfully
                        updateLikeCount(podcastId,"unlike")
                        toast.success('Podcast removed from likedPodcasts array')
                    }
                    )
                    .catch((error) => {
                        console.error('Error removing podcast ID from likedPodcasts array:', error);
                        toast.error('Error removing podcast ID from likedPodcasts array')
                    }
                    );
            }
        }
    };



    const handleLikePodcast = async (podcastId) => {
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
        
        if (userEmail) {
          // Check if the 'users' collection exists, create it if not present
          const usersCollectionRef = collection(db,"users")
          const userDocRef = doc(usersCollectionRef, userEmail);
        
          setDoc(userDocRef, {}, { merge: true })
            .then(() => {
              // 'users' collection exists or has been created
        
              // Update the document to add the podcast ID to the 'likedPodcasts' array
              updateDoc(userDocRef, {
                likedPodcasts: arrayUnion(podcastId),
              })
                .then(() => {
                    setLiked(prev => !prev)
                  console.log('Podcast ID added to likedPodcasts array');
                  updateLikeCount(podcastId,"like")
                  // Like operation completed successfully
                    toast.success('Podcast added to likedPodcasts array')
                })
                .catch((error) => {
                  console.error('Error adding podcast ID to likedPodcasts array:', error);
                  // Handle the error
                  toast.error('Error while adding podcast to likedPodcasts array')
                });
            })
            .catch((error) => {
              console.error('Error creating/updating user document:', error);
              // Handle the error
              toast.error('Error while adding podcast to likedPodcasts array')
            });
        }
    };

    const updateLikeCount = (id,reason) => {
        Axios.put(`http://localhost:3001/api/update-like/${id}`, {reason})
          .then((response) => {
            console.log(response.data.message);
            // Handle the response as needed
          })
          .catch((error) => {
            console.error('Error updating like count:', error);
            // Handle the error
          });
      };
      

    return(
        <div>
            {podcast ? <div className="podcast-main-page">
                    <div className="insert-btn">
                        <BiLogOut className="search-icon" color="white" size={22}/>
                        <button onClick={() => {props.setPodcastToNull()}}>Back</button>
                    </div>

                    <div className="podcast-main-content">
                        <div className="iframe-container">
                            {loading && <img style={{height:'50px',position:"absolute"}} src={Spinner} alt="" />}
                            <iframe onLoad={() => {setLoading(false)}} className={"iframe"} src={podcast.embedLink.split(' ')[2].split('"')[1]} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                        </div>
                        <div className="podcast-inner-content">
                            <div className="podcast-description">
                                <span>Description</span>
                                <br />
                                {podcast.description}
                            </div>

                            <div className = "podcast-info">
                                <div style={{marginLeft:"0px"}}>
                                    <span>Title</span>
                                    <p className="podcast-title">{podcast.title}</p>
                                </div>

                                <div>
                                    <span>Artist</span>
                                    <p className="podcast-artist">{podcast.artistName}</p>
                                </div>

                                <div >
                                    <span>Genre</span>
                                    <p className="podcast-genre">{podcast.genre}</p>
                                </div>
                                <div style={{display:"flex",alignItems:"center",marginRight:"0px", width:"100px"}}>
                                    <p style={{display:"block",margin:"5px"}}>Like</p>                                    
                                    {
                                        liked 
                                        ?
                                        <AiFillHeart size={25} onClick={() => handleUnLikePodcast(podcast.ID)} color="#de3636"/> 
                                        :
                                        <AiOutlineHeart size={25} onClick={() => handleLikePodcast(podcast.ID)} color="#de3636"/>
                                    }

                                </div>
                            </div>

                        </div>
                    </div>
            </div> : <img src={Spinner} alt="loading.."></img>}
        </div>
    )
}
