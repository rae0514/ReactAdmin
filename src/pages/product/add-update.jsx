import React, { useEffect, useRef, useState } from 'react'
import { Card, Space, Form, Input, Button, Cascader, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqAddProduct, reqCategory, reqUpdateProduct } from '../../api'
import { useLocation, useNavigate } from 'react-router-dom'
import PicUpload from './pic-upload'
import RichTextEditor from './rich-text-editor'


export default function AddUpdate() {

  const navigate = useNavigate()
  const [options, setOptions] = useState([])
  const editor = useRef()

  const product = useLocation().state.product || {}

  console.log(useLocation())

  let categoryIds = []
  if(Object.keys(product).length) {
    if(product.pcategoryId === 'string') {
      categoryIds.push(product.categoryId*1)
    }else {
      categoryIds.push(product.pcategoryId*1)
      categoryIds.push(product.categoryId*1)
    }
  }

  const formItemLayout =
  {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 11,
    },
  }

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const result = await getCategories(targetOption.value)

    if(result.length === 0) {
      targetOption.isLeaf = true
    } else {
      targetOption.children = result.map(option => ({
        label: option.name,
        value: option.id,
        isLeaf: true
      }))
    }
    targetOption.loading = false

    setOptions([...options])

  }

  async function onFinish(values) {
    values.detail = editor.current.getDetail()
    console.log(values)
    const { desc, detail, name, price } = values
    let pcategoryId, categoryId
    if(values.categoryIds.length === 1) {
      pcategoryId = 'string'
      categoryId = values.categoryIds[0] + ""
    }else {
      pcategoryId = values.categoryIds[0] + ""
      categoryId = values.categoryIds[1] + ""
    }
    if(Object.keys(product).length) {
      const productInfo = {...product, desc, detail, name, price, pcategoryId, categoryId}
      const result = await reqUpdateProduct(product.id, productInfo)
      if(result.data.status === 0) {
        message.success('?????????????????????')
        navigate('/products/product', {replace:true})
      }
    }else {
      const productInfo = {categoryId, desc, detail, images: '1,jpg,2.png', name, pcategoryId, price, status: 1, v:0}
      const result = await reqAddProduct(productInfo)
      if(result.data.status === 0) {
        message.success('?????????????????????')
        navigate('/products/product', {replace:true})
      }
    }
  }

  function validatePrice(rule, value) {
    if(value*1 <= 0) {
      return Promise.reject('?????????????????????0')
    }else if(value === undefined) {
      return Promise.reject('????????????????????????')
    }else {
      return Promise.resolve()
    }
  }

  async function initOptions(result) {
    const options = result.map((option) => ({
      label: option.name,
      value: option.id,
      isLeaf: false
    }))

    if(Object.keys(product).length && product.pcategoryId !== 'string') {
      const subCategory = await getCategories(product.pcategoryId)
      const subOptions = subCategory.map((option) => ({
        label: option.name,
        value: option.id,
        isLeaf: true
      }))

      const targetOption = options.find(option => option.value === product.pcategoryId*1)
      targetOption.children = subOptions
    }

    setOptions(options)
  }

  async function getCategories(parentId) {
    const result = await reqCategory(parentId)
    if(result.status === 200) {
      if(parentId === 'string') {
        initOptions(result.data.data)
      }else {
        return result.data.data
      }
    }
  }

  function goBack() {
    navigate('/products/product', {replace:true, state:{title:'????????????'}}) 
  }

  useEffect(() => {
    getCategories('string')
  }, []) //eslint-disable-line

  return (
    <Card
      title = {(
        <Space>
          <ArrowLeftOutlined onClick={() => goBack()} style={{color:'#13967b', marginRight:'10'}} />
          <span>{Object.keys(product).length ? '????????????' : '????????????'}</span>
        </Space>
      )}  
    >
      <Form
        {...formItemLayout}
        layout='horizontal'
        onFinish={onFinish}
        initialValues={{
          name: product.name,
          desc: product.desc,
          price: product.price,
          categoryIds
        }} 
      >
        <Form.Item 
          label='???????????????'
          name='name'
          rules={[
            {
              required: true,
              message: '????????????????????????'
            }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item 
          label='???????????????'
          name='desc'
          rules={[
            {
              required: true,
              message: '????????????????????????'
            }
          ]}
        >
          <Input.TextArea placeholder='?????????????????????' rows={1} />
        </Form.Item>
        <Form.Item 
          label='???????????????'
          name='price'
          rules={[
            {validator:validatePrice}
          ]}
          required
        >
          <Input type='number' addonAfter="???" />
        </Form.Item>
        <Form.Item 
          label='???????????????'
          name='categoryIds'
          rules={[
            {
              required: true,
              message: '????????????????????????'
            }
          ]}
        >
          <Cascader placeholder='???????????????' options={options} loadData={loadData} />
        </Form.Item>
        <Form.Item 
          label='???????????????'
        >
          <PicUpload/>
        </Form.Item>
        <Form.Item 
          label='???????????????'
          name='detail'
          labelCol={{span:3}}
          wrapperCol={{span:20}}
        >
          <RichTextEditor detail={product.detail} ref={editor}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>??????</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
