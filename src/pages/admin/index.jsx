import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

const { Footer, Sider, Content } = Layout

export default function Admin() {

  const navigate = useNavigate()

  useEffect(() => {
    if(!memoryUtils.user.id) {
      navigate('/login', {replace:true})
    } 
  })

  return (
    <Layout style={{minHeight:'100%'}}>
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{margin:'20px',backgroundColor:'white'}}>
          <Outlet />
        </Content>
        <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
      </Layout>
    </Layout>
  )
}
