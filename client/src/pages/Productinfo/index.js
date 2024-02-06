import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { GetAllBids, GetProductById } from '../../apicalls/products'
import { Button, message } from 'antd'
import { SetLoader } from '../../redux/loadersSlice'
import Divider from '../../components/Divider'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import BidModal from './BidModal'

function Productinfo() {
    const { user } = useSelector((state) => state.users);
    const [showAddNewBid, setShowAddNewBid] = React.useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [product, setProduct] = React.useState(null);
    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProductById(id);
            dispatch(SetLoader(false));
            if (response.success) {
                const bidsResponse = await GetAllBids({ product: id })
                setProduct({
                    ...response.data,
                    bids: bidsResponse.data
                });
            }

        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    React.useEffect(() => {
        getData();
    }, [])
    return (
        product && <div>
            <div className='grid grid-cols-2 gap-5 mt-5'>
                {/*Images*/}
                <div className='flex flex-col gap-5'>
                    <img src={product.images[selectedImageIndex]} alt='' className='w-full h-84 rounded-md object-cover p-20' />
                    <div className='flex gap-5'>
                        {product.images.map((image, index) => {
                            return (
                                <img className={"w-20 h-20 object-cover rounded-md cursor-pointer " +
                                    (selectedImageIndex === index ? "border-2 border-green-700 border-solid p-2" : "")}
                                    alt=''
                                    src={image}
                                    onClick={() => setSelectedImageIndex(index)} />
                            )
                        })}
                    </div>
                    <div >
                        <Divider />
                        <h1 className='text-gray-700'>Added On</h1>
                        <span className='text-gray-700'>
                            {moment(product.createdAt).format("MMM D YYYY hh:mm A")}
                        </span>
                    </div>
                </div>
                {/*Details*/}
                <div className='flex flex-col gap-3'>
                    <div>
                        <h1 className='text-2xl font-semibold text-orange-900'>{product.name}</h1>
                        <span>{product.description}</span>
                    </div>
                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-orange-900'>Product Details</h1>
                        <div className='flex justify-between mt-2'>
                            <span>Price</span>
                            <span>Rs {product.price}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Category</span>
                            <span className='uppercase'>{product.category}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Bill Available</span>
                            <span>{product.billAvailable === true ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Box Available</span>
                            <span>{product.boxAvailable === true ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Warranty Available</span>
                            <span>{product.warrantyAvailable === true ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Accessories Available</span>
                            <span>{product.accessoriesAvailable === true ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Purchased Year</span>
                            <span>
                                {moment().subtract(product.age,'years').format("YYYY")} ({product.age} years ago)    
                            </span>
                        </div>

                    </div>
                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-orange-900'>Seller Details</h1>
                        <div className='flex justify-between mt-2'>
                            <span>Seller Name</span>
                            <span>{product.seller.name}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <span>Email</span>
                            <span className='uppercase'>{product.seller.email}</span>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex flex-col'>
                        <div className='flex justify-between mt-2 mb-5'>
                            <h1 className='text-2xl font-semibold text-orange-900'>Bids</h1>
                            <Button onClick={() => setShowAddNewBid(!showAddNewBid)}
                                disabled={product.seller._id === user._id}>
                                New Bid
                            </Button>
                        </div>
                        { product.showBidsOnProductPage &&
                            product?.bids?.map((bid) => {
                            return (
                                <div className='border border-gray-400 border-solid p-3 rounded mt-5'>
                                    <div className='flex justify-between'>
                                        <span>Name</span>
                                        <span>{bid.buyer.name}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Bid Amount</span>
                                        <span>Rs {bid.bidAmount}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Bid Placed On</span>
                                        <span>{
                                            moment(bid.createdAt).format("MMM D , YYYY hh:mm A")
                                            }</span>
                                    </div>
                                </div>

                            )
                        })}

                    </div>
                </div>
            </div>
            {showAddNewBid && <BidModal
                product={product}
                reloadData={getData}
                showBidModal={showAddNewBid}
                setShowBidModal={setShowAddNewBid}
            />}
        </div>
    )
}

export default Productinfo