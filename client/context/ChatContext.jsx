import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket,axios}= useContext(AuthContext);

    // function to get all useres for sidebar
    const getUsers = async () => {
        try {
            const {data} = await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }
    // function to get messages for selected users 
     const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
           toast.error(error.messages);
        }
    }

    // function to send message
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prev)=>[...prev,data.message]);
                // socket.emit('send-message',data.newMessage);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }
// function to subscribe to message for selected user 

const subscribeToMessages = () => {
    if(!socket) return;
    socket.on('newMessage',(newMessage)=>{
        if(selectedUser && newMessage.senderId===selectedUser._id){
           newMessage.seen=true;
           setMessages((prev)=>[...prev,newMessage]);
           axios.put(`/api/messages/mark/${newMessage._id}`)
        }
        else{
            setUnseenMessages((prevUnseenMessages)=>(
                {
                 ...prevUnseenMessages,
                 [newMessage.senderId]:prevUnseenMessages[newMessage.senderId]?prevUnseenMessages[newMessage.senderId]+1
                    :1
                
                }
            )

            )
        }
    })
}

// function to unsubscribe from message 
const unsubscribeFromMessages = () => {
    if(socket) socket.off('newMessage');
}
// useEffect(()=>{
//     getMessages(selectedUser?._id);
// },[messages])
useEffect(() => {
 

  if (!socket || !selectedUser) return;

  const handleConnection = () => {
    subscribeToMessages();
  };

  if (socket.connected) {
    handleConnection();
  } else {
    socket.once("connect", handleConnection);
  }

  return () => {
    unsubscribeFromMessages();
    socket?.off("connect", handleConnection);
  };
}, [socket, selectedUser]);
    const value={
        users,
        selectedUser,
        getUsers,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        messages,
        getMessages

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
