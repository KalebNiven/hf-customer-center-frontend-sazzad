import React,{useEffect} from "react";
import { useLogout } from "../../hooks/useLogout";


const Logout = () =>{
    const logoutApi = useLogout();
    useEffect(() =>{
         logoutApi();
    },[])
    return (<></>);
}
export default Logout;