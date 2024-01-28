import { Col, Form, Input, Modal, Row, Tabs, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { AddProduct } from '../../../apicalls/products'
import { getData } from '../Products/index'


const additionalthings = [
    {
        label: "Bill Available",
        name: "billAvailable"
    },
    {
        label: "Warranty Available",
        name: "warrantyAvailable"
    },
    {
        label: "Accessories Available",
        name: "accessoriesAvailable"
    },
    {
        label: "Box Available",
        name: "boxAvailable"
    },
]

const rules = [{
    required: true,
    message: "Required",
}]

function ProductsForm({
    showProductForm,
    setShowProductForm, selectedProduct, getData }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)

    const onFinish = async (values) => {
        try {
            values.seller = user._id;
            values.status = "pending";
            dispatch(SetLoader(true));
            // console.log(values);
            const response = await AddProduct(values);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
                setShowProductForm(false);

            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    const formRef = useRef(null);    // Using ok buuton as submit button
    useEffect(() => {
        if (selectedProduct) {
            formRef.current.setFieldValue(selectedProduct);
        }
    }, [selectedProduct])

    return (
        <Modal
            title=""
            open={showProductForm}
            onCancel={() => setShowProductForm(false)}
            centered
            width={1000}
            okText="Save"
            onOk={() => {
                formRef.current.submit();
            }}>
            <div>
                <h1 className="text-primary text-2xl text-center font-semibold uppercase">
                    {selectedProduct ? "Edit Product" : "Add Product"}
                </h1>
                <Tabs defaultActiveKey='1'>
                    <Tabs.TabPane tab="General" key="1">
                        <Form layout='vertical' ref={formRef} onFinish={onFinish}>
                            <Form.Item label="Name" name='name' rules={rules}>
                                <Input type='text' />
                            </Form.Item>
                            <Form.Item label="Description" name='description' rules={rules}>
                                <TextArea type='text' />
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item label="Price" name='price' rules={rules}>
                                        <Input type='number' />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Category" name='category' rules={rules}>
                                        <select>
                                            <option value="">Select</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="fashion">Fashion</option>
                                            <option value="home">Home</option>
                                            <option value="sports">Sports</option>
                                        </select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Age" name='age' rules={rules}>
                                        <Input type='number' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className='flex gap-10'>
                                {additionalthings.map((item) => (
                                    <Form.Item label={item.label} name={item.name} key={item.name}>
                                        <Input
                                            type='checkbox'
                                            value={item.name}
                                            onChange={(e) => {

                                                formRef.current.setFieldsValue({
                                                    [item.name]: e.target.checked,
                                                });
                                            }}
                                            checked={formRef.current?.getFieldValue(item.name)}
                                        ></Input>
                                    </Form.Item>
                                ))}
                            </div>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Images" key="2">
                        Images
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Modal>
    )
}

export default ProductsForm