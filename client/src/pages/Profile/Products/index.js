import { Button, Table, message } from 'antd'
import React, { useEffect } from 'react'
import ProductsForm from './ProductsForm';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { GetProducts } from '../../../apicalls/products';

function Products() {
    const [selectedProduct,setselectedProduct] = React.useState(null);
    const [products,setProducts] = React.useState([]);
    const [showProductForm, setShowProductForm] = React.useState(false);
    const dispatch = useDispatch();

    const getData = async()=>{
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts();
            dispatch(SetLoader(false));
            if(response.success){
                
                setProducts(response.products);
            }
            
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
            render : (text,record)=>{
                return <div className='flex gap-5'>
                    <i className="ri-delete-bin-fill"></i>
                    <i className="ri-edit-fill" onClick={()=>{
                        setselectedProduct(record);
                        setShowProductForm(true);
                    }}></i>
                </div>
            }
        }
    ]
    useEffect(()=>{
        getData();
    },[]);
    return (
        <div>
            <div className='flex justify-end mb-2'>
            <Button type='default' onClick={() => setShowProductForm(true)}>
                Add Product
            </Button>
            </div>
            
            <Table columns={columns} dataSource={products} />
            {showProductForm && (
            <ProductsForm 
            showProductForm={showProductForm} 
            setShowProductForm={setShowProductForm} 
            selectedProduct={selectedProduct}
            getData={getData}
            />
                        
            )}
        
        </div>
        
    )
}

export default Products