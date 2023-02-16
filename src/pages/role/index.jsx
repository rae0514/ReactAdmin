import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Table, Space, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constant.js'
import { reqAddAuth, reqAddRole, reqRoles } from '../../api/index.js'
import AddModal from './add-modal.jsx'
import AuthModal from './auth-modal.jsx'
import { getDate } from '../../utils/dateUtils'
import authName from '../../utils/memoryUtils'
import user from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { useNavigate } from 'react-router-dom'

export default function Role() {

  const [roles, setRoles] = useState([])
  const [role, setRole] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [showAuth, setAuthAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const addInfo = useRef()
  const authInfo = useRef()
  const navigate = useNavigate()

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '授权时间',
      dataIndex: 'authTime'
    },
    {
      title: '授权人',
      dataIndex: 'authName'
    }
  ]

  const title = (
    <Space>
      <Button type='primary' onClick={() => setShowAdd(true)}>创建角色</Button>
      <Button type='primary' onClick={() => setAuthAdd(true)} disabled={!Object.keys(role).length}>设置角色权限</Button>
    </Space>
  )

  function onRow(role) {
    return {
      onClick: (e) => {
        setRole(role)
      }
    }
  }

  async function getRoles() {
    setLoading(true)
    const result = await reqRoles()
    if(result.data.status === 0) {
      setRoles(result.data.data)
      setLoading(false)
    }
  }

  function handleAdd() {
    addInfo.current.validateFields()
    .then(async values => {
      const result = await reqAddRole(values.name)
      if(result.status === 200) {
        message.success('创建角色成功')
        addInfo.current.resetFields()
        setShowAdd(false)
        getRoles()
      }
    })
    .catch(error => {
      message.error('创建角色失败')
    })
  }

  async function handleAuth() {
    if(!authInfo.current.checkedKeys){
      message.error('您未做修改！')
      return
    }
    const menus = authInfo.current.checkedKeys.join()
    role.menus = menus
    role.authTime = getDate(Date.now())
    role.authName = authName.user.name
    const result = await reqAddAuth(role.id, role)
    if(result.status === 200) {
      if(user.user.roleId*1===role.id*1) {
        message.success('当前权限已修改，请重新登录！')
        user.user = {}
        storageUtils.removeUser()
        navigate('/login', {replace:true})
      }else {
        setAuthAdd(false)
        getRoles()
      }
    }
  }

  function handleCancel() {
    setShowAdd(false)
    addInfo.current.resetFields()
  }

  function handleAuthCancel() {
    setAuthAdd(false)
  }

  useEffect(() => {
    getRoles()
  }, []) //eslint-disable-line

  return (
    <Card
      title={title}
    >
      <Table 
        rowKey='id'
        bordered={true}
        rowSelection={{
          type:'radio', 
          selectedRowKeys:[role.id],
          onChange:(_, selectedRows) => {
            setRole(selectedRows[0])
          }
        }}
        dataSource={roles} 
        columns={columns}
        onRow={onRow}
        pagination={{pageSize:PAGE_SIZE}}
        loading={loading}
      />
      <Modal title='新建角色' open={showAdd} onOk={handleAdd} onCancel={handleCancel}>
        <AddModal ref={addInfo}/>
      </Modal>
      <Modal title='设置角色权限' destroyOnClose open={showAuth} onOk={handleAuth} onCancel={handleAuthCancel}>
        <AuthModal ref={authInfo} role={role} />
      </Modal>
    </Card>
  )
}