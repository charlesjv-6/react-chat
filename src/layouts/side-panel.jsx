import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatList } from "../services/api/chat";
import { useParams } from 'react-router-dom';
import '../services/prototype/string';

function SidePanel({ themeToggle }) {
    const { chatId } = useParams();
    const [selected, setSelected] = useState(chatId);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const user = sessionStorage.getItem('user'); 
    let sessionUser;

    if(user) {
        try {
            sessionUser = JSON.parse(user);
        } catch (error) {}
    }

    useEffect(() => {
        try {
            if(sessionUser) {
                const wsClient = new WebSocket('ws://localhost:3001');
                wsClient.onopen = () => {
                    wsClient.send(JSON.stringify({ type: 'logged-in', userId: sessionUser.id }));
                };
                wsClient.onmessage = (message) => {
                    const dataFromServer = JSON.parse(message.data);
                    if (dataFromServer.type === 'chatList') {
                        // Sort messages within each chat by createdAt
                        const sortedChats = dataFromServer.data.map(chat => {
                            // Ensure messages are sorted by createdAt
                            const sortedMessages = chat.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                            return {
                                ...chat,
                                messages: sortedMessages
                            };
                        }).sort((a, b) => {
                            // Sort chats based on the createdAt of the first message
                            const firstMessageA = a.messages[0];
                            const firstMessageB = b.messages[0];
                            if (firstMessageA && firstMessageB) {
                                return new Date(firstMessageB.createdAt) - new Date(firstMessageA.createdAt);
                            }
                            return 0;
                        });
                
                        setData(sortedChats);
                    } 
                    else if (dataFromServer.type === 'newMessage') {
                        const { chatId, message: newMessage } = dataFromServer;
                
                        setData(prevData => {
                            const updatedData = prevData.map(chat => {
                                if (chat.id === chatId) {
                                    const updatedMessages = [...(chat.messages || []), newMessage];
                
                                    // Sort messages by createdAt
                                    updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                                    return {
                                        ...chat,
                                        messages: updatedMessages
                                    };
                                }
                                return chat;
                            });
                
                            // Sort chats by the createdAt of the first message
                            return updatedData.sort((a, b) => {
                                const firstMessageA = a.messages[0];
                                const firstMessageB = b.messages[0];
                                if (firstMessageA && firstMessageB) {
                                    return new Date(firstMessageB.createdAt) - new Date(firstMessageA.createdAt);
                                }
                                return 0;
                            });
                        });
                    }
                };
        
                return () => {
                    if (wsClient) {
                        wsClient.close();
                    }
                };
            }
        } catch (error) {
            console.error('Failed to fetch chat list:', error);
        }
    }, [data]); //sessionUser, data

    const renderThreads = ()=> {
        return data && data.map(conv => (
            <div className={`thread radius-full padded ${conv.id === selected ? 'selected' : ''}`} key={conv.id} onClick={()=> {
                setSelected(conv.id);
                navigate(`/t/${conv.id}`);
            }}>
                <img className="image circular center-y" src="https://th.bing.com/th/id/OIP.hxRValICG6OlXI56NUfSjAHaF1?rs=1&pid=ImgDetMain" alt="profile" />
                <div className="flex-column">
                    <h3>{`${conv.messages[0].receiver.firstName} ${conv.messages[0].receiver.lastName}`}</h3>
                    <span>{conv.messages[0].sender.id === sessionUser.id ? 'You' : `${conv.messages[0].sender.firstName} ${conv.messages[0].sender.lastName}`}: {conv.messages[0].content.trimWithEllipsis(20)}</span>
                </div>
            </div>
        ));
    };
    return (
        <main className="side-panel radius-full">
            <header className="flex-column padded transparent title">
                <span className="flex-row">
                    <p>Chats</p>
                    <button className="transparent no-border s">
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z"></path>
                                </g>
                        </svg>
                    </button>
                    <button className="transparent no-border s toggle-theme" onClick={themeToggle}>
                        <svg width="25px" height="25px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                                <g id="Layer_2" data-name="Layer 2"> 
                                    <g id="Icons">
                                        <g>
                                            <g> 
                                                <path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z"></path> 
                                                <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z"></path> 
                                            </g> 
                                        </g> 
                                    </g> 
                                </g> 
                            </g>
                        </svg>
                    </button>
                </span>
                <input className="radius-full padded search" type="search" placeholder="Search Chats" name="" id="" />
            </header>
            <div className="content padded scrollable-y">
                { renderThreads() }
            </div>
            <footer className="padded flex-row user">
                <div className="flex-row">
                    <img className="image s circular center-y" src="https://th.bing.com/th/id/OIP.hxRValICG6OlXI56NUfSjAHaF1?rs=1&pid=ImgDetMain" alt="profile" />
                    <p className="center-y">{`${sessionUser.firstName} ${sessionUser.lastName}`}</p>
                </div>
                <button className="center-y transparent no-border" onClick={()=>{
                    sessionStorage.removeItem('user');
                    navigate('/');
                }}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 6.5C2 4.01472 4.01472 2 6.5 2H12C14.2091 2 16 3.79086 16 6V7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7V6C14 4.89543 13.1046 4 12 4H6.5C5.11929 4 4 5.11929 4 6.5V17.5C4 18.8807 5.11929 20 6.5 20H12C13.1046 20 14 19.1046 14 18V17C14 16.4477 14.4477 16 15 16C15.5523 16 16 16.4477 16 17V18C16 20.2091 14.2091 22 12 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5ZM18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071C17.9024 15.3166 17.9024 14.6834 18.2929 14.2929L19.5858 13L11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11L19.5858 11L18.2929 9.70711C17.9024 9.31658 17.9024 8.68342 18.2929 8.29289Z"></path> 
                        </g>
                    </svg>
                </button>
            </footer>
        </main>
    );
}

export default SidePanel;