import React, { useEffect, useState } from 'react'
import { GetCurrentUser } from '../apicalls/users';
import { Avatar, Badge, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Notifications from './Notifications';
import { GetAllNotifications, ReadAllNotification } from '../apicalls/notifications';


function ProtectedPage({ children }) {
    const [notifications = [], setNotifications] = React.useState([])
    const [showNotifications, setShowNotifications] = React.useState(false)
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const readNotification = async()=>{
        try {
            const response = await ReadAllNotification();
            if(response.success){
                getNotifications();
                
            }
            else{
                throw new Error(response.message)
            }
        } catch (error) {
            message.error(error.message);
        }
    }
    const getNotifications = async ()=>{
        try {
            
            const response = await GetAllNotifications();
            if(response.success){
                setNotifications(response.data)
            }
            else{
                throw new Error(response.message)
            }
        } catch (error) {
            message.error(error.message);
        }
    }
    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCurrentUser()
            dispatch(SetLoader(false));
            if (response.success) {
                dispatch(SetUser(response.data))
            } else {
                navigate("/login")
                message.error(response.message)

            }

        } catch (error) {
            dispatch(SetLoader(false));
            navigate("/login")
            message.error(error.message);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
            getNotifications()
        } else {
            navigate("/login");
        }
    }, []);
    return (
        user && (
            <div>
                {/*Header*/}
                <div className='flex justify-between items-center bg-primary p-5'>
                    <h1 className='text-2xl text-white cursor-pointer' onClick={() => navigate("/")}>
                        Market Place
                    </h1>
                    <div className='bg-white py-2 px-5 rounded flex gap-1 items-center'>

                        <span className='underline cursor-pointer uppercase' onClick={() => {
                            if (user.role === 'user') {
                                navigate("/profile")
                            } else {
                                navigate("/admin")
                            }

                        }}>
                            {user.name}

                        </span>

                        <Badge
                            count={notifications?.filter((notification) => !notification.read).length}
                            onClick={() => {
                                readNotification();
                                setShowNotifications(true);}}>
                            <Avatar size="medium"><i class="ri-notification-line cursor-pointer"></i></Avatar>
                        </Badge>
                        <i className="ri-logout-box-r-line ml-10 cursor-pointer" onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}></i>
                    </div>
                </div>
                <div className='p-5'>{children}</div>
                { <Notifications 
                showNotifications={showNotifications} 
                setShowNotifications={setShowNotifications} 
                notifications={notifications}
                reloadNotifications={getNotifications} />
                }

            </div>)

    )
}

export default ProtectedPage