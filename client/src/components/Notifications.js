import { Modal, message } from 'antd'
import React from 'react'
import Divider from '../components/Divider'
import { useNavigate } from 'react-router-dom'
import { DeleteNotification } from '../apicalls/notifications';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';
import moment from 'moment';

function Notifications({
    notifications = [],
    reloadNotifications,
    showNotifications,
    setShowNotifications
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteNotification = async (id) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteNotification(id);

            if (response.success) {
                message.success(response.message)
                reloadNotifications();
                dispatch(SetLoader(false));
            }
            else {
                throw new Error(response.message)
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    return (
        <Modal title='Notifications'
            open={showNotifications}
            onCancel={() => setShowNotifications(false)}
            footer={null}
            centered
            width={1000}>
            <div className='flex flex-col gap-2'>
                {notifications.map((notification) => (
                    <div className='flex border border-solid border-gray-300 p-2 flex-col rounded cursor-pointer'
                        key={notification._id}
                    >
                        <div className='flex justify-between items-center ' 
                            >
                            <div onClick={() => {
                            navigate(notification.onClick);
                            setShowNotifications(false);
                        }}>
                                <h1 className='text-gray-700'>{notification.title}</h1>
                                <span className='text-gray-400'>{notification.message}</span>
                                <h1 className='text-gray-500 text-sm'>{moment(notification.createdAt).fromNow()}</h1>
                            </div>
                            <i className="ri-delete-bin-fill" onClick={() => {
                                deleteNotification(notification._id);
                                
                            }}></i>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default Notifications