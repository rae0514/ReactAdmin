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
        message.success('修改商品成功！')
        navigate('/products/product', {replace:true})
      }
    }else {
      const productInfo = {categoryId, desc, detail, images: '1,jpg,2.png', name, pcategoryId, price, status: 1, v:0}
      const result = await reqAddProduct(productInfo)
      if(result.data.status === 0) {
        message.success('新增商品成功！')
        navigate('/products/product', {replace:true})
      }
    }
  }

  function validatePrice(rule, value) {
    if(value*1 <= 0) {
      return Promise.reject('商品价格需大于0')
    }else if(value === undefined) {
      return Promise.reject('商品价格不能为空')
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
    navigate('/products/product', {replace:true, state:{title:'商品管理'}}) 
  }

  useEffect(() => {
    getCategories('string')
  }, []) //eslint-disable-line

  return (
    <Card
      title = {(
        <Space>
          <ArrowLeftOutlined onClick={() => goBack()} style={{color:'#13967b', marginRight:'10'}} />
          <span>{Object.keys(product).length ? '修改商品' : '添加商品'}</span>
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
          label='商品名称：'
          name='name'
          rules={[
            {
              required: true,
              message: '商品名称不能为空'
            }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item 
          label='商品描述：'
          name='desc'
          rules={[
            {
              required: true,
              message: '商品描述不能为空'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入商品描述' rows={1} />
        </Form.Item>
        <Form.Item 
          label='商品价格：'
          name='price'
          rules={[
            {validator:validatePrice}
          ]}
          required
        >
          <Input type='number' addonAfter="元" />
        </Form.Item>
        <Form.Item 
          label='商品分类：'
          name='categoryIds'
          rules={[
            {
              required: true,
              message: '商品分类不能为空'
            }
          ]}
        >
          <Cascader placeholder='请选择分类' options={options} loadData={loadData} />
        </Form.Item>
        <Form.Item 
          label='商品图片：'
        >
          <PicUpload/>
        </Form.Item>
        <Form.Item 
          label='商品详情：'
          name='detail'
          labelCol={{span:3}}
          wrapperCol={{span:20}}
        >
          <RichTextEditor detail={product.detail} ref={editor}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
