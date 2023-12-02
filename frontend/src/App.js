import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { format } from "timeago.js";
import { Room, Star } from "@material-ui/icons";
import axios from 'axios';
import Register from "./components/Register";
import Login from "./components/Login";
import 'mapbox-gl/dist/mapbox-gl.css';
import './app.css';
 

function App() {
  const myStorage= window.localStorage;
  const [currentUsername,setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
 
  const[showRegister, setShowRegister]=useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport]=useState({
    width:"100vw",
    height:"100vh",
    latitude:46,
    longitude:17,
    zoom:8,
  })

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id,lat,long) => {
    console.log("Clicked marker with ID:", id);
    setViewport({...viewport,latitude:lat, longitude:long});
    setCurrentPlaceId(id);
  };

  const handleAddClick =(e) =>{
    e.preventDefault();
    console.log(e);
    console.log("dilip");
    console.log(e.lngLat);
    // const {long,lat}= e.lngLat;
    const long =e.lngLat.lng;
    const lat= e.lngLat.lat;

    console.log(lat,long);
    
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const newPin={
      username:currentUsername,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    }

    try{
      const res= await axios.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);
    }
    catch(err)
    {
      console.log(err);
    }
  };

  const handleLogout=()=>{
    setCurrentUsername(null);
    myStorage.removeItem("user");
    setShowLogin(false)
    setShowRegister(false)
    
  }

  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          longitude: 82,
          latitude: 23,
          zoom: 4
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={currentUsername && handleAddClick}
      >
        {pins.map((p) => (
          <Marker
            key={p._id}
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom*2}
            offsetRight={-viewport.zoom*3}
          >
            <Room
              style={{ 
                fontSize:viewport.zoom *7,
                color: p.username=== currentUsername? "tomato" :"slateblue", fontSize: "2rem", cursor: "pointer" }}
              onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
            />
          </Marker>
        ))}
        {pins.map((p) => (
          (p._id === currentPlaceId) && (
            <Popup
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={()=>setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill( <Star className="star" />)}
                 
                </div>
                <label>Information</label>
                <span className="username">Created by <b>{p.username}</b></span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )
        ))}
        {newPlace && (
          <Popup
             
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={()=>setNewPlace(null)}
            >
            <div>
             <form onSubmit={handleSubmit} >
               <label>Title</label>
               <input placeholder='Enter a title' onChange={(e)=>setTitle(e.target.value)} />
               <label>Review</label>
               <input placeholder='Describe the place' onChange={(e)=>setDesc(e.target.value)} />
               <label>Rating</label>
               <select onChange={(e)=>setRating(e.target.value)}>
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
                 <option value="5">5</option>
                 

               </select>

               <button className="submitButton" type="submit">Add Pin</button>


             </form>



            </div>
            </Popup>
        )}
        {currentUsername? ( <button className="button logout" onClick={handleLogout}>Log Out</button>):( <div className="buttons">
        <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
        <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
        </div>) }
       {showRegister &&  <Register setShowRegister={setShowRegister}/>}
       {showLogin && (
         <Login setShowLogin={setShowLogin}  setCurrentUsername={setCurrentUsername}
         myStorage={myStorage}
       />
       )}
      </Map>
    </div>
  );
}

export default App;
