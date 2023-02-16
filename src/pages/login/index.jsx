import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import logo from '../../assets/images/logo.png'
import './index.css'
import storageUtils from '../../utils/storageUtils'

export default function Login() {

  const navigate = useNavigate()

  useEffect(() => {
    if(memoryUtils.user.id) {
      navigate('/', {replace:true})
    }
  })

  async function onFinish(values) {
    const {username, password} = values
    const response = await reqLogin(username, password)
    console.log(response.data)
    if(response.data.status === 0) {
      message.success('登录成功', () => {
        memoryUtils.user = response.data.data
        storageUtils.setUser(response.data.data)
        navigate('/', {replace:true})
      })
    }else {
      message.error('登录名或密码错误')
    }
  }

  function onFinishFailed() {
    console.log('校验失败')
  }

  function validatorPwd(rule, value) {
    if(!value) {
      return Promise.reject('密码必须填写')
    }
    // else if(value.length < 4) {
    //   return Promise.reject('密码长度需大于等于4位')
    // }
    else if(value.length > 12) {
      return Promise.reject('密码长度需小于等于12位')
    }else if(!/^[A-Za-z0-9_]+$/.test(value)){
      return Promise.reject('密码由字母、数字、下划线组成')
    }else{
      return Promise.resolve()
    }
  }

  return (
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt="logo" />
        <h1>React项目：后台管理系统</h1>
      </header>
      <section className='login-section'>
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, whitespace: true, message: '用户名必须填写' },
              { min: 4, message: '用户名需大于4位' },
              { max: 12, message: '用户名需小于12位' },
              { pattern: /^[A-Za-z0-9_]+$/, message: '用户名由字母、数字、下划线组成' }
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { validator:validatorPwd },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )
}
