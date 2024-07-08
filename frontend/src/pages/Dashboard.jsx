import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const location = useLocation();
    const {username} = location.state || {}
    
    useEffect(() => {
        axios.get("https://paytm-clone-server.vercel.app/api/v1/account/balance", {
            headers : {
                Authorization : "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setBalance(response.data.balance)
        })
    },[balance])
    
    return (
        <div>
            {/* {console.log(firstName + " " + lastName)} */}
            <Appbar name={username} />
            <div>
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    )
}
