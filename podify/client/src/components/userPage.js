import React from "react";
import {useNavigate} from "react-router-dom";
import Axios from "axios";
import {FaRegCopyright} from "react-icons/fa";
import {BiSearchAlt, BiLogOut} from "react-icons/bi";
import Spinner from '../loader.svg'
import { auth } from "../Firebase.js";
import { db } from '../Firebase.js';
import { doc,collection, getDoc, setDoc} from 'firebase/firestore';
import PodcastPage from "./podcast";
import {nanoid} from "nanoid";
import img from "./user.png";
import LikedPodcasts from "./likedPodcasts";
import { AiFillHeart } from "react-icons/ai";
import { RiHistoryFill } from "react-icons/ri";
import RecentPodcasts from "./recentPodcasts";
import {FiMusic} from "react-icons/fi";
import TopHits from "./topHits";

export default function UserPage(props){
    const navigate = useNavigate();

    const [podcasts,setpodcasts] = React.useState(null)
    const [fetching,setFetching] = React.useState(true)
    const [podcast,setPodcast] = React.useState(null)
    const [tab,setTab] = React.useState("main");
    const [likedPodcasts,setLikedPodcasts] = React.useState([])

    React.useEffect(() => {
        console.log('Fetching')
        Axios.request('http://localhost:3001/api/get/')
            .then((response) => {
                let temp = []
                let podsList = []

                response.data.map(x => {
                    if(!temp.includes(x.genre)){
                        temp.push(x.genre)
                        podsList[[x.genre]] = []
                    }
                })
                console.log(podsList)

                response.data.map(x => {
                    podsList[[x.genre]].push(x)
                })

                console.log((podsList))
                setpodcasts(podsList)

                setFetching(false)
            })
    }, [])

    const openLikedPodcasts = () => {
        // Fetching IDs of liked podcasts from Firebase
        let likedPodcasts = [];
        const getLikedPodcasts = async () => {
          const userEmail = auth.currentUser ? auth.currentUser.email : null;
          if (userEmail) {
            console.log(userEmail);
            const userDocRef = doc(db, "users", userEmail);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              likedPodcasts = userData.likedPodcasts;
              setLikedPodcasts(likedPodcasts);
              setTab('liked');
            } else {
              // Create the user document if it doesn't exist
              setDoc(userDocRef, { likedPodcasts: [] }, { merge: true })
                .then(() => {
                  console.log("User document created");
                  setLikedPodcasts([]);
                  setTab('liked');
                })
                .catch((error) => {
                  console.error("Error creating user document:", error);
                  // Handle the error
                });
            }
          }
        };
        getLikedPodcasts();
      };

    return(
        <div className="main-section">
            <div className = "side-bar"> 

                <div className="profile-section">
                    <img style={{height:"30px"}} src={img} alt="" />
                    <h1>Welcome Back, {auth.currentUser ? auth.currentUser.displayName : navigate('/')}</h1>   
                </div>    

                <div className="side-content">
                    <div className="options" onClick = {openLikedPodcasts}>
                        Liked Podcasts
                        <AiFillHeart size={20} color="#1e1e1e" style={{position:"absolute",left:"62px",top:"288px"}}/>
                    </div>        
                    <div className="options" onClick = {() => setTab('recent')}>
                        Recently added
                        <RiHistoryFill size={20} color="#1e1e1e" style={{position:"absolute",left:"62px",top:"401px"}}/>
                    </div>        
                    <div className="options" onClick = {() => setTab('top')}>
                        TOP HITS
                        <FiMusic size={20} color="#1e1e1e" style={{position:"absolute",left:"62px",top:"513px"}}/>
                    </div>          
                    <div className="options" onClick = {() => navigate('/')}>
                        Logout
                        <BiLogOut size={20} color="#1e1e1e" style={{position:"absolute",left:"62px",top:"626px"}}/>
                    </div>          
                </div>    

                <div className="side-footer">
                    <FaRegCopyright size={22}/>
                    <p>Bugs</p>
                </div>

            </div>

            {
                <div className="user-main-page">
                    {tab === 'main'&&
                        (<div>  
                            <div className="top-part">
                                <div className="search-bar">
                                    <BiSearchAlt className="search-icon" color="white" size={22}/>
                                    <input type="text" placeholder="Serach with title"/>
                                </div>
                            </div>
                            
                            <div className="main-part">
                                {!fetching ?
                                    Object.keys(podcasts).map(item => {
                                        return (<div key = {nanoid()}>
                                            <h2>{item}</h2>
                                            <div className="podcast-list">
                                                {   
                                                    podcasts[item].map(podcast => (
                                                        <div onClick = {() => {setPodcast(podcast); setTab('podcast')}} key={podcast.ID} className="podcast">
                                                            <img className="cover-image" src={podcast.coverImage} alt="" />
                                                            <h5>{podcast.title}</h5>
                                                        </div>   
                                                    )
                                                )
                                                }
                                            </div>
                                        </div>)
                                    })
                                : <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80%"}}>
                                    <img style={{height:'50px'}} src={Spinner} alt="Loading..." />
                                    </div>
                                }
                            </div>
                        </div>)
                    }

                    {tab === 'podcast' && <PodcastPage activePodcast={podcast} setPodcastToNull = {() => {setPodcast(null);setTab('main')}}/>}

                    {tab === 'liked' && <LikedPodcasts setPodcast = {(podcast) => setPodcast(podcast)} setTab = {(tab) => setTab(tab)} likedList = {likedPodcasts} goBack = {() => {setTab('main');setLikedPodcasts(null)}}/>}
                    
                    {tab === 'recent' && <RecentPodcasts setPodcast = {(podcast) => setPodcast(podcast)} setTab = {(tab) => setTab(tab)} goBack = {() => {setTab('main');setLikedPodcasts(null)}}/>}
                    
                    {tab === 'top' && <TopHits setPodcast = {(podcast) => setPodcast(podcast)} setTab = {(tab) => setTab(tab)} goBack = {() => {setTab('main');setLikedPodcasts(null)}}/>}
                </div>
            }
            
        </div>
    )
}