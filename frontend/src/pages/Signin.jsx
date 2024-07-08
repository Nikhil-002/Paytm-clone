import { useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSignIn = async() => {
        const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
            username,
            password
        })
        localStorage.setItem("token", response.data.token)
        navigate("/dashboard", {state: {username}})
    }
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign In"}/>
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox onChange={(e)=> {
                        setUsername(e.target.value)
                    }} placeholder="john@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) =>{
                        setPassword(e.target.value)
                    }} placeholder="12345" label={"Password"} />
                    <div className="pt-4">
                        <Button onClick={handleSignIn} label={"Sign In"} />
                    </div>
                    <BottomWarning label={"Don't have an account"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    )
}