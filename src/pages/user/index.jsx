import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Table, Space, Modal, ConfigProvider, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { PAGE_SIZE } from '../../utils/constant'
import { reqUpdateUser, reqAddUser, reqDeleteUsers, reqRoles, reqUsers } from '../../api'
import UserForm from './user-form'

export default function User() {

  const [users, setUsers] = useState()
  const [roles, setRoles] = useState()
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const [selectUser, setSelectUser] = useState({})
  const userInfo = useRef()
 
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime'
    },
    {
      title: '所属角色',
      dataIndex: 'roleId',
      render: (roleId) => {
        return (roles.find(role => role.id*1 === roleId*1)).name
      }
    },
    {
      title: '操作',
      render: (role) => (
        <Space>
          <a onClick={(e) => handleUpdate(e, role)} href='javascript;' style={{color:'#13967b'}}>修改</a>
          <a onClick={(e) => handleDelete(e, role)} href='javascript;' style={{color:'#13967b'}}>删除</a>
        </Space>
      )
    }
  ]

  function handleUpdate(e, role) {
    console.log(role)
    e.preventDefault()
    setSelectUser(role)
    setIsOpen(true)
  }

  async function handleDelete(e, role) {
    e.preventDefault()
    modal.confirm({
      title: `确定删除${role.name}吗？`,
      icon: <ExclamationCircleFilled />,
      okButtonProps: {},
      onOk: async () => {
        const result = await reqDeleteUsers(role.id)
        console.log(result)
        if(result.status === 200) {
          message.success('删除成功')
          getUsers()
        }
      }
    })
  }

  async function getUsers() {
    setLoading(true)
    const result = await reqUsers()
    const roles = await reqRoles()
    if(roles.status === 200) {
      setRoles(roles.data.data)
    }
    if(result.status === 200) {
      setUsers(result.data)
      setLoading(false)
    }
  }

  async function handleSubmit() {
    const {name, password, phone, email, roleId} = userInfo.current.getFieldsValue()
    const user = {email, name, password, phone, roleId}
    let result
    if(Object.keys(selectUser).length === 0) {
      result = await reqAddUser(user)
    }else {
      user.password = selectUser.password
      result = await reqUpdateUser(selectUser.id, user)
    }
    if(result.status === 200) {
      message.success(Object.keys(selectUser).length > 0 ? '修改用户成功' : '创建用户成功')
      userInfo.current.resetFields()
      setIsOpen(false)
      setSelectUser({})
      getUsers()
    }
  }

  useEffect(() => {
    getUsers()
  }, []) //eslint-disable-line

  return (
      <Card
        title={<Button onClick={() => setIsOpen(true)} type='primary'>创建用户</Button>}
      >
        <ConfigProvider
          theme={{
            token: {colorPrimary:'#13967b'}
          }}
        >
          {contextHolder}
        </ConfigProvider>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={users}
          loading={loading}
          bordered={true}
          pagination={{pageSize:PAGE_SIZE}}
        />
        <Modal title={Object.keys(selectUser).length > 0 ? '修改用户' : '创建用户'} open={isOpen} onOk={() => handleSubmit()} onCancel={() => {
          setIsOpen(false)
          setSelectUser({})
          userInfo.current.resetFields()
        }} >
          <UserForm roles={roles} ref={userInfo} selectUser={selectUser} />
        </Modal>
      </Card>
  )
}
