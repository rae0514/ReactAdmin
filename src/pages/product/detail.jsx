import React from 'react'
import { Card, List, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { reqSearchCategory } from '../../api'
import { useState } from 'react'

export default function Detail() {

  const navigate = useNavigate()
  const [cName1, setName1] = useState('')
  const [cName2, setName2] = useState('')
  const {name, desc, price, detail, pcategoryId, categoryId} = useLocation().state.product || {}
  console.log(useLocation().state)

  function goBack() {
    navigate('/products/product', {replace:true, state:{title:'商品管理'}})
  }

  async function getCategory() {
    if(pcategoryId === 'string') {
      const result = await reqSearchCategory(categoryId)
      setName1(result.data.name)
    }else {
      const results = await Promise.all([reqSearchCategory(pcategoryId), reqSearchCategory(categoryId)])
      setName1(results[0].data.name)
      setName2(results[1].data.name)
    }
  }

  useEffect(() => {
    getCategory()
  }, []) //eslint-disable-line

  return (
    <Card
      title={(
        <Space>
          <ArrowLeftOutlined onClick={() => goBack()} style={{color:'#13967b', marginRight:'10'}} />
          <span>商品详情</span>
        </Space>
      )}
    >
      <List>
        <List.Item>
          <Space>
            <span className='detailTitle'>商品名称：</span>
            <span>{name}</span>
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <span className='detailTitle'>商品描述：</span>
            <span>{desc}</span>
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <span className='detailTitle'>商品价格：</span>
            <span>{price}元</span>
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <span className='detailTitle'>所属分类：</span>
            <span>{cName1} {cName2 ? '-->' + cName2:''}</span>
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <span className='detailTitle'>商品图片：</span>
            <img className='detailImg' src="https://ms.bdimg.com/pacific/0/pic/643770465_-1403049163.jpg?x=0&y=0&h=150&w=242&vh=150.00&vw=242.00&oh=150.00&ow=242.00" alt="" />
            <img className='detailImg' src="https://ms.bdimg.com/pacific/0/pic/643770465_-1403049163.jpg?x=0&y=0&h=150&w=242&vh=150.00&vw=242.00&oh=150.00&ow=242.00" alt="" />
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <span className='detailTitle'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}/>
          </Space>
        </List.Item>
      </List>
    </Card>
  )
}
