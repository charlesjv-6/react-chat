import React, { useEffect, useRef, useState } from 'react';
import Header from "../components/header";
import { getMessages, sendChat, getMembers } from "../api/chat";
import { useParams } from 'react-router-dom';
import '../services/prototype/string';

function Thread() {
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [newChat, setNewChat] = useState('');
    const user = sessionStorage.getItem('user');
    const [client, setClient] = useState(null);
    const chatContainerRef = useRef(null);
    const { chatId } = useParams();

    let sessionUser;
    let receiverId;

    if(user) {
        try {
            sessionUser = JSON.parse(user);
        } catch (error) {}
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        getMembers(chatId).then(res => setMembers(res.members));

        const wsClient = new WebSocket('ws://localhost:3001');
        wsClient.onopen = () => {
            console.log('WebSocket Client Connected');
            wsClient.send(JSON.stringify({ type: 'join', chatId }));
        };

        wsClient.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.type === 'chatHistory') {
                const sortedMessages = dataFromServer.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setMessages(sortedMessages);
            } else if (dataFromServer.type === 'newMessage' && dataFromServer.message.chatId === chatId) {
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, dataFromServer.message];
                    return updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                });
            }
        };

        wsClient.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsClient.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        setClient(wsClient);

        return () => {
            if (wsClient) {
                wsClient.close();
            }
        };
    }, [chatId]); 
    
    useEffect(()=>{
        scrollToBottom();
    },[messages]);
    if(members && members.length === 2){
        members.forEach(member => {
            if(member.userId !== sessionUser.id) {
                receiverId = member.userId;
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (client && newChat.trim()) {
            const message = {
                type: 'newMessage',
                chatId,
                senderId: sessionUser.id, 
                receiverId: receiverId,
                content: newChat,
            };
            client.send(JSON.stringify(message));
            setNewChat('');
        }
    };

    const displayDate = (currentMessage, previousMessage) => {
        const currentDate = new Date(currentMessage.createdAt);
        const previousDate = new Date(previousMessage.createdAt);
    
        const currentDateOnly = currentDate.toDateString();
        const previousDateOnly = previousDate.toDateString();
    
        return currentDateOnly !== previousDateOnly ? true : false;
    };

    const renderActions = id => {
        return (
            <>
                <button className="center-full transparent no-border s">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z"></path> <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z"></path> <path d="M8 14C7.44772 14 7 14.4477 7 15C7 15.5523 7.44772 16 8 16H15.9991C16.5514 16 17 15.5523 17 15C17 14.4477 16.5523 14 16 14H8Z"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z"></path> </g>
                    </svg>
                </button>
                <button className="center-full transparent no-border s">
                    <svg width="25px" height="25px" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>reply</title> <path d="M0 14.031l8.563 7.938v-3.969s12.156-3.125 15.406 7.656c0 0 1.156-15.438-15.406-15.438v-3.875z"></path> </g>
                    </svg>
                </button>
                <button className="center-full transparent no-border s">
                    <span style={{fontSize: '20px', color: 'var(--text)'}}>•••</span>
                </button>
            </>
        )
    }
    
    return (
        <main className="radius-full">
            <Header />
            <div className="padded scrollable-y chat-container" ref={chatContainerRef}>
                {messages && messages.map((message, index) => (
                    <div className="chat">
                        {index === 0 || displayDate(message, messages[index - 1]) ? (
                            <div className="time">
                                {message.createdAt.formatToTimeOrDate('date')}
                            </div>
                        ) : null}
                        <div className={`${message.senderId === sessionUser.id ? 'right' : 'left'} flex-row`} key={message.id}>
                            { message.type === 'received' && 
                                <img className="image ss circular bottom" src="https://th.bing.com/th/id/OIP.hxRValICG6OlXI56NUfSjAHaF1?rs=1&pid=ImgDetMain" alt="profile" key={`profile-${index}`}/>
                            }
                            <p className={`${message.senderId === sessionUser.id ? 'sent' : 'received'} padded`} title={message.createdAt.formatToTimeOrDate('time')}>{message.content}</p>
                            {renderActions(message.id)}
                        </div>
                        {/* <div className={`${message.senderId === sessionUser.id ? 'right' : 'left'} flex-row`}>
                            { message.type === 'received' && message.images.length > 0 &&
                                <img className="image ss circular bottom" src="https://th.bing.com/th/id/OIP.hxRValICG6OlXI56NUfSjAHaF1?rs=1&pid=ImgDetMain" alt="profile" key={`profile-${index}`}/>
                            }
                            { message.images &&
                                <div className="flex-column">
                                    {message.images.map(src => (
                                        <img className="sent-image radius-full" src={src} alt="image-msg" key={`${message.id}`}/>
                                    ))}
                                </div>
                            }
                        </div> */}
                        { (messages.length - 1) === index &&
                            <span className="end"/>
                        }
                    </div>
                ))}
            </div>
            <div className="input-container padded flex-row">
                <button className="transparent no-border s">
                    <svg width="30px" height="30px" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44771 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8Z"></path> <path fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"></path> </g>
                    </svg>
                </button>
                <button className="transparent no-border s">
                    <svg width="30px" height="30px" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"></path> <path d="M4.80665 17.5211L9.1221 9.60947C9.50112 8.91461 10.4989 8.91461 10.8779 9.60947L14.0465 15.4186L15.1318 13.5194C15.5157 12.8476 16.4843 12.8476 16.8682 13.5194L19.1451 17.5039C19.526 18.1705 19.0446 19 18.2768 19H5.68454C4.92548 19 4.44317 18.1875 4.80665 17.5211Z"></path> <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z"></path> </g>
                    </svg>
                </button>
                <form onSubmit={handleSubmit}>
                    <input className="chat-input radius-full padded" type="text" placeholder="Aa" value={newChat} onChange={(e)=> setNewChat(e.target.value)}/>
                </form>
            </div>
        </main>
    )
}

export default Thread;