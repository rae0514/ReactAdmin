import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.css'
import weather from '../../assets/images/logo.png'
import { reqWeather } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { getDate } from '../../utils/dateUtils'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {

  const [weatherInfo, setWeather] = useState('')
  const [user, setUser] = useState('')
  const [time, setTime] = useState(getDate(Date.now()))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {title} = useLocation().state || {title:'首页'}
  const navigate = useNavigate()

  function getUser() {
    const user = memoryUtils.user.name
    setUser(user)
  }

  async function getWeather() {
    const weather = await reqWeather(110101)
    setWeather(weather.data.lives[0].weather)
  }

  function getTime() {
    const time = getDate(Date.now())
    setTime(time)
  }

  function showModal() {
    setIsModalOpen(true)
  }

  function handleOk() {
    setIsModalOpen(false)
    memoryUtils.user = {}
    storageUtils.removeUser()
    navigate('/login', {replace:true})
  }

  function handleCancel() {
    setIsModalOpen(false)
    console.log('cancel')
  }

  useEffect(() => {
    getWeather()
    getUser()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      getTime()
    }, 1000);
    return () => {
      clearTimeout(timer)
    }
  })

  return (
    <div className='header'>
      <div className='header-top'>
        <span>欢迎, {user}</span>
        <Button style={{color:'#13967b'}} type="link" onClick={showModal}>
          退出
        </Button>
        <Modal title="确认退出吗？" okText='确定' cancelText='取消' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        </Modal>
      </div>
      <div className='header-bottom'>
        <div className="header-bottom-left">{title}</div>
        <div className="header-bottom-right">
          <span>{time}</span>
          <img src={weather} alt="weather" />
          <span>{weatherInfo}</span>
        </div>
      </div>
    </div>
  )
}
