import { Button, Upload, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { UploadProductImage } from '../../../apicalls/products';

function Images({selectedProduct,
    getData,
    setShowProductForm,}
    
) {
    const [showPreview = false, setShowPreview] = React.useState(true)
    const [file = null, setFile] = React.useState(null);
    const [images = [],setImages] = React.useState(selectedProduct.images);
    const dispatch = useDispatch();
    const upload = async()=>{
        try {
            dispatch(SetLoader(true))
            const formData = new FormData();
            formData.append("file",file);
            formData.append("productId",selectedProduct._id);
            
            const response = await UploadProductImage(formData);
            dispatch(SetLoader(false))
          
            if(response.success){
                message.success(response.message)
                setImages([...images, response.data])
                getData();
                setShowPreview(false);
                setFile(null);
            }else{
                
                message.error(response.message);
            }

        } catch (error) {
            dispatch(SetLoader(false))
            message.error(error.message)
        }
    };
    return (
        <div>
            <Upload
                listType='picture'
                beforeUpload={() => false}
                onChange={(info) => {
                    setFile(info.file);
                    setShowPreview(true);
                }}
            showUploadList = {showPreview}
            >
            <div className='flex gap-5 mb-5'>
            {
                    images.map((image)=>{
                    return <div className='flex gap-2 border border-solid border-gray-500 rounded p-3 items-end'>
                        <img className='h-20 w-20 object-cover' src={image} alt='' />
                        <i className="ri-delete-bin-fill" onClick={()=>{
                        
                    }}></i>
                    </div>
                    })
            }
            </div>
            
                <Button type='dashed'>
                    Upload Image
                </Button>
            </Upload>
            <div className='flex justify-end gap-5 mt-5'>
                <Button type='default' onClick={() =>{
                    setShowProductForm(false);
                }}>Cancel</Button>
                
                <Button type='primary' onClick={upload} disabled={!file}>Upload</Button>
            </div>
        </div>
    )
}

export default Images