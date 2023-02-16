import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { menuList } from '../../utils/constant'
import user from '../../utils/memoryUtils'
import logo from '../../assets/images/logo.png'
import './index.css'
import { reqGetRole } from '../../api'

export default function LeftNav() {

  const [items, setItems] = useState()

  const navigate = useNavigate()
  let path = useLocation().pathname
  if(path.indexOf('/products/product')===0) {
    path = '/products/product'
  }
  const rank = path.split('/')
  const openKey = [rank[1]]

  function handleClick(e) {
    let title = ''
    items.forEach(item => {
      if(item.key === e.key) {
        title = item.label
      }else if(item.children) {
        const cItem = item.children.find(cItem => cItem.key === e.key)
        if(cItem) {
          title = cItem.label
        }
      }
    })
    navigate(e.key, {state:{title}})
  }

  async function initialRole() {

    const result = await reqGetRole(user.user.roleId)
    const menus = result.data.menus
    console.log(menus)

    let items = []
    if(user.user.name === 'admin' || menus.split(',').indexOf('all') !== -1) {
      setItems(menuList)
    }else if(!menus) {
      items.push(menuList[0])
      setItems(items)
    }else {
      menuList.forEach(item => {
        if(menus.split(',').indexOf(item.key) !== -1) {
          items.push(item)
        }else if(item.children) {
          const cItem = item.children.filter(cItem =>  menus.split(',').indexOf(cItem.key) !== -1)
          const newItem = {...item, children:cItem}
          items.push(newItem)
        }
      })
      setItems(items)
    }
  }

  useEffect(() => {
    initialRole()
  }, []) //eslint-disable-line
 
  return (
    <div className='left-nav'>
      <Link to='/home' className='left-nav-header'>
        <img src={logo} alt="logo" />
        <h1>硅谷后台</h1>
      </Link>
      <Menu
        selectedKeys={[path]}
        defaultOpenKeys={openKey}
        mode="inline"
        theme="dark"
        items={items}
        onClick={(e) => handleClick(e)}
      />
    </div>
  )
}
