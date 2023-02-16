import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Select, Input, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqProduct, reqProductByName, reqProductByDesc, reqChangeStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constant'
import { useNavigate } from 'react-router-dom'

export default function Product() {

  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [searchType, setSearchType] = useState('1')
  const [searchName, setSearchName] = useState('')
  const [pageNum, setPageNum] = useState(1)
  const title = (
    <Space>
      <Select value={searchType} onChange={value => setSearchType(value)}>
        <Select.Option value='1'>按名称搜索</Select.Option>
        <Select.Option value='2'>按描述搜索</Select.Option>
      </Select>
      <Input value={searchName} placeholder='请输入关键字' onChange={e => setSearchName(e.target.value)}></Input>
      <Button type='primary' onClick={() => getProducts(1)}>搜索</Button>
    </Space>
  )
  
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      className: 'columnsClass'
    },
    {
      title: '商品描述',
      dataIndex: 'desc'
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price) => '¥' + price
    },
    {
      width: 80,
      title: '状态',
      render: (product) => (
        <span>
          <Button onClick={() => changeStatus(product)} type='primary'>{product.status === 1 ? '下架' : '上架'}</Button>
          <span>{product.status === 1 ? '在售' : '已下架'}</span>
        </span>
      )
    },
    {
      width: 80,
      title: '操作',
      render: (product) => (
        <div style={{textAlign:'center'}}>
          <a onClick={(e) => goDetail(e, product)} href='javascript;' style={{color:'#13967b'}}>详情</a><br/>
          <a onClick={(e) => goAddUpdate(e, product)} href='javascript;' style={{color:'#13967b'}}>修改</a>
        </div>
      )
    }
  ]

  async function changeStatus(product) {
    const status = product.status===1 ? 2 : 1
    const result = await reqChangeStatus(product.id, status)
    if(result.status === 200) {
      message.success(status === 1 ? '商品已上架' : '商品已下架')
      getProducts(pageNum)
    }else {
      message.error(status === 1 ? '上架失败' : '下架失败')
    }
  }

  function goDetail(e, product) {
    e.preventDefault()
    navigate('detail', {state:{product, title:'商品管理'}})
  }

  function goAddUpdate(e, product) {
    if(e) {
      e.preventDefault()
    }
    navigate('addupdate', {state:{product, title:'商品管理'}})
  }

  async function getProducts(pageNum) {
    setLoading(true)
    setPageNum(pageNum)
    let result 
    if(searchName) {
      if(searchType === '1') {
        result = await reqProductByName(pageNum, searchName, PAGE_SIZE)
      }else {
        result = await reqProductByDesc(searchName, PAGE_SIZE, pageNum)
      }
    }else {
      result = await reqProduct(pageNum, PAGE_SIZE)
    }
    setLoading(false)
    if(result.status === 200) {
      setProducts(result.data.list)
      setTotal(result.data.total)
    }else {
      message.error('请检查网络')
    }
  }

  useEffect(() => {
    getProducts(1)
  }, []) //eslint-disable-line

  return (
    <Card
      title={title}
      extra={<Button onClick={() => goAddUpdate()} type='primary'>
      <PlusOutlined />
      添加
      </Button>}  
    >
      <Table
        bordered
        loading={loading}
        rowKey='id'
        dataSource={products}
        columns={columns}
        pagination={
          {total:total, 
           pageSize:PAGE_SIZE,
           current:pageNum, 
           showQuickJumper:true, 
           onChange:getProducts
          }}
      />
    </Card>
  )
}
