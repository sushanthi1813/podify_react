import {React,useEffect,useState} from "react"
import { auth } from '../Firebase';
import {toast} from "react-toastify"
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    getAuth
} from 'firebase/auth';
import {HiOutlineMail} from "react-icons/hi"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import {BiUser} from "react-icons/bi"
import {useNavigate} from "react-router-dom"
import {db} from '../Firebase'
import { collection, getDocs } from "firebase/firestore";

export default function App(){
    const [login,setLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);


    const [admins, setAdmins] = useState([]);
    const adminsCollectionRef = collection(db, "admins")
    useEffect( () => {
        const getAdmins = async() => {
            const data = await getDocs(adminsCollectionRef);
            setAdmins(data.docs.map((doc) => {
                return {...doc.data()}
            }))
        }

        getAdmins()
    },[])

    const navigate = useNavigate();
    const [signinData, setSigninData] = useState({
        email: "",
        password: "",
    })
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: ''
    })

    async function handleForgotPassword(e) {
        e.preventDefault();
        if (signinData.email.trim() !== '') {
          try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, signinData.email);
            toast.success('mail was successfully sent');
          } catch (error) {
            console.log(error);
            toast.error("Couldn't send reset password to given mail id");
          }
        } else {
          toast.error('Enter a valid Email');
        }
      }
    

    function handleFormChange(event) {
        if (login) {
            setSigninData(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value
                }
            })
        }
        else {
            setRegisterData(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value
                }
            })
        }

    }

    async function signinUser(){
        try{
            const userCredential = await signInWithEmailAndPassword(
                auth,
                signinData.email,
                signinData.password
            )

            if(userCredential.user){

                for (let i = 0; i < admins.length; i++) {
                    if (admins[i].email === signinData.email) {
                        toast.success("You are successfully signed in as Admin!");
                        navigate("/admin");
                        return;
                    }
                }
                toast.success("You are successfully signed in!");
                navigate("/user")
            }
            else{
                toast.error("Bad User Credential")
            }
        }

        catch(error){
            let message = (error.message.split('/')[1]);
            if(message === 'wrong-password).'){
                toast.error('Incorrect Password. Try Again')
            }
            else if(message === 'user-not-found).'){
                toast.error("User Not Found")
            }
            else if(message === "network-request-failed)."){
                toast.error("Network Error")
            }
            else{
                toast.error("Something went wrong")
            }
        }
    }

    async function registerUser(){
        try{
    
            await createUserWithEmailAndPassword(
                auth,
                registerData.email,
                registerData.password
            );
    
            updateProfile(auth.currentUser, {
                displayName:registerData.name
            })
            toast.success("You are successfully registered");
            setLogin(true);
        }
        catch(error){
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="LoginPage">
            
            <div className = "container">
                <h1>Podify</h1>
                <h2>Discover Hidden Gems and Classic Favorites in Our Vast Podcast Library.</h2>
                <img className="podcast-img" src={require("./podcast.jpg")} alt="" />
            </div>

            <div className = "form-container">

                <div className="positions">
                    <span className={login? "active" : ""} onClick={() => {setLogin(true);registerData.email='';registerData.name='';registerData.password='';}}>SIGN IN</span>
                    <span className={!login? "active" : ""}  onClick={() => {setLogin(false);signinData.email='';signinData.password='';}}>SIGN UP</span>
                </div>           

                {login && <div className="inputs">
                    <div className="email">
                        <HiOutlineMail size={20} className="icon"/>
                        <input onChange= {handleFormChange} value={signinData.email} type="email" name = "email" placeholder="Email"/>
                    </div>
                    {forgotPassword === false && <div className="password">

                        <input onChange= {handleFormChange} value={signinData.password} type={showPassword? "text" : "password"}  name = "password" placeholder="Password"/>
                        {
                            !showPassword &&
                            <AiFillEye
                            size={20}
                            className={!showPassword && 'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                            />
                        }
                        {
                            showPassword &&
                            <AiFillEyeInvisible
                            size={20}
                            className={'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                        />}
                    </div>}
                    
                    <div>
                        <div className = "inner-inp">
                            <span className="forgot-pass" onClick={() => setForgotPassword((prev) => !prev)}>{forgotPassword? "Login instead"  : "Forgot Password"}?</span>
                        </div>
                    </div>
                    <button onClick={forgotPassword? handleForgotPassword :signinUser}>{forgotPassword ? "Get Reset Password":"SIGN IN"}</button>
                    </div> 
                }              



                {!login && <div className="inputs">
                    <div className="name">
                        <input onChange= {handleFormChange} value={registerData.name} type="name" name = "name" placeholder="Name"></input>
                        <BiUser size={20} className="icon"/>
                    </div>

                    <div className="email">
                        <HiOutlineMail size={20} className="icon"/>
                        <input onChange= {handleFormChange} value={registerData.email} type="email" name = "email" placeholder="Email"/>
                    </div>
                    <div className="password">

                        <div className="password">

                        <input onChange= {handleFormChange} value={registerData.password} type={showPassword? "text" : "password"} name = "password" placeholder="Password"/>
                        {
                            !showPassword &&
                            <AiFillEye
                            size={20}
                            className={!showPassword && 'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                            />
                        }
                        {
                            showPassword &&
                            <AiFillEyeInvisible
                            size={20}
                            className={'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                        />}
                    </div>
                        {
                            !showPassword &&
                            <AiFillEye
                            size={20}
                            className={!showPassword && 'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                            />
                        }
                        {
                            showPassword &&
                            <AiFillEyeInvisible
                            size={20}
                            className={'password-icon'}
                            onClick={() => setShowPassword(prev => !prev)}
                        />}
                    </div>
                    <button onClick={registerUser}>SIGN UP</button>
                </div> 
                }
            </div>
        </div>
    )
}