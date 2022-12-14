import "../css/Home.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import Button from '@mui/material/Button';
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import {SocketContext} from "../context/socket"
import { useCookies } from 'react-cookie';

//TODO: if multiple pages exist on the same browser, close previous sockets?
function Home(){
    const socket=useContext(SocketContext);
    const [cookies, setCookie, removeCookie]=useCookies(null);
    const navigate=useNavigate();
    useEffect(()=>{
        //check if username if valid
        socket.emit("getUsername", cookies.username);
        //if current in a room: exit the room and set cookies.room to null
        if(cookies.room){
            socket.emit("exitRoom", cookies.room);
            removeCookie("room");
        }
    },[])
    socket.on("getUsername", (name)=>{
        // backend will return a name if current one is invalid
        if(name)setCookie("username", name);
    });
    const createRoom=async()=>{
        //backend create a room number. 
        socket.emit("createRoom", cookies.username);
        socket.on("createRoomResponse", (roomNumber)=>{
            console.log("running");
            setCookie("room", roomNumber);
            navigate("/waitingroom",{state:{roomNumber}});
        })
    }
    const joinRoom=()=>{
        navigate("/join");
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="homePageView">
            <HeaderBar username={cookies.username}></HeaderBar>
            <div id="homeCenterDiv">
                <div id="homeContentDiv">
                    <div id="homeButtonsDiv">
                        <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginBottom:"50px"}} onClick={createRoom}>Create a room</Button>
                        <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold"}} onClick={joinRoom}>Join a room</Button>
                    </div>
                </div>
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default Home