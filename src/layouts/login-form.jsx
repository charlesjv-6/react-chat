import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/auth";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleOnSubmit = async (e)=> {
        e.preventDefault();
        try {
            const result = await auth(email, password);
            if(result.success) {
                navigate('/t/list');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
    return (
        <>
            <div className="screen-overlay"/>
            <form onSubmit={e => handleOnSubmit(e)} className="login-form radius-full flex-column">
                <h2>Not Messenger</h2>
                <span>
                    <label>Email: </label>
                    <input type="text" className="padded radius-full" onChange={e => setEmail(e.target.value)}/>
                </span>
                <span>
                    <label>Password: </label>
                    <input type="password" className="padded radius-full" onChange={e => setPassword(e.target.value)}/>
                </span>
                <input type="submit" value="Login" className="padded radius-full"/>
            </form>
        </>
    );
}

export default LoginForm;