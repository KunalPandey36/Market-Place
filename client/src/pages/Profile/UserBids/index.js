import { Modal, Table, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice';

import moment from 'moment';
import { GetAllBids } from '../../../apicalls/products';



function Bids(
) {
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.users);
    const [bidsData, setBidsData] = React.useState([])
    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllBids({
                buyer : user._id
            });
            dispatch(SetLoader(false));
            if (response.success) {

                setBidsData(response.data);
            }

        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    const columns = [
        {
            title: "Product",
            dataIndex : 'product',
            render:(text,record)=>{
                return record.product.name
            }
        },
        {
            title: "Seller",
            dataIndex: "seller",
            render:(text,record)=>{
                return record.seller.name
            }
        },
        {
            title: "Offered Price",
            dataIndex: "offeredPrice",
            render:(text,record)=>{
                return record.product.price
            }
        },
        {
            title: "Bid Amount",
            dataIndex: "bidAmount"
        },
        {
            title: "Bid Placed On",
            dataIndex: "createdAt",
            render: (text, record) => {
                return moment(text).format("MMMM Do YYYY, h:mm a")
            }
        },
        {
            title: "Message",
            dataIndex: "message"
        },
    ]
    useEffect(() => {
        getData();
    }, []);

    return (
        
            <div className='flex flex-col gap-3'>
                
                <Table columns={columns} dataSource={bidsData} />
            </div>
        
    )
}

export default Bids