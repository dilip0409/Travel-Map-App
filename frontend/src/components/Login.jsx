import "./Login.css"
import {Cancel, Room} from "@material-ui/icons";
import {useRef,useState} from "react";
import axios from "axios";

export default function Login({setShowLogin,setCurrentUsername,myStorage}) {
   
    const [error,setError]=useState(false);
    const usernameRef= useRef();
    
    const passwordRef=useRef();


    const handleSubmit= async(e)=>{
        e.preventDefault();
        const user={
            username: usernameRef.current.value,
          
            password:passwordRef.current.value,
        };

        try{
           const res=await axios.post("/users/login",user);
           console.log(res.data);
          
           setCurrentUsername(res.data.username);
           myStorage.setItem("user",res.data.username);
           setShowLogin(false)
           setError(false);
           
        }
        catch(err)
        {
             setError(true);
             
        }
    };

  return (
    <div className="loginContainer">
    <div className="logo">
        <Room/>Travel Map 
    </div>
    <form onSubmit={handleSubmit}>
     <input type="text" placeholder="username" ref={usernameRef}/>

     <input type="password" placeholder="password" ref={passwordRef}/>

     <button className="loginBtn" type="submit">Login</button>
    
     {error && 
     <span className="failure">Something went Wrong!</span>
       }  



    </form>

    <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
      
    </div>
  );
}




