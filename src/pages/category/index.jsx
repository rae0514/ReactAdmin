import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Table, Space, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { reqAddCategory, reqCategory, reqUpdateCategory } from '../../api';
import AddModal from './add-modal';
import UpdateModal from './update-modal';

export default function Category() {

  const [data, setData] = useState([])
  const [subData, setSubData] = useState([])
  const [chooseData, setChooseData] = useState({})
  const [parentId, setParentId] = useState('string')
  const [parentName, setParentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpdate, setShowUpdate] = useState(0)
  const updateData = useRef()
  const addData = useRef()
  const title = parentId === 'string' ? '一级分类列表' : (
    <Space>
      <Button onClick={() => {showData()}} type='link' style={{color:'#13967b'}}>一级分类列表</Button>
      <ArrowRightOutlined style={{marginRight:10}} />
      <span>{parentName}</span>
    </Space>
  )


  async function getData(parentId) {
    setLoading(true)
    const result = await reqCategory(parentId)
    if(result.data.status === 0 || result.data.status === -1) {
      setLoading(false)
      if(parentId === 'string') {
        setData(result.data.data)
      }else {
        setSubData(result.data.data)
      }
    }else {
      setLoading(false)
      message.error('请求出错')
    }
  }

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: '65%'
    },
    {
      title: '操作',
      render: (data) => (
        <Space size='small'>
          <a href='javasscript;' onClick={(e) => updateCategory(e, data)} style={{color:'#13967b'}}>修改分类</a>
          {parentId === 'string' ? <a onClick={(e) => getSubData(e, data)} href='javascript;' style={{color:'#13967b'}}>查看子分类</a> : null}
        </Space>
      ),
    },
  ]

  function getSubData(e, data) {
    e.preventDefault()
    setParentId(data.id)
    setParentName(data.name)
  }

  function showData() {
    setParentId('string')
    setParentName('')
    setSubData([])
  }

  function handleUpdate() {
    updateData.current.validateFields()
    .then(async (values) => {
      const name = values.title
      const result = await reqUpdateCategory(chooseData.id, name)
      if(result.data.status === 0) {
        getData(parentId)
        setChooseData({})
        setShowUpdate(0)
      }else {
        message.error('修改失败')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  function handleAdd() {
    addData.current.validateFields()
    .then(async (values) => {
      const oldParentId = parentId
      const formData = addData.current.getFieldsValue()
      const name = formData.title
      const newParentId = formData.chooseParent.value
      const parentName = formData.chooseParent.label
      const result = await reqAddCategory(name, newParentId, parentName)
      if(result.data.status === 0) {
        addData.current.resetFields()
        setShowUpdate(0)
        if(oldParentId === newParentId) {
          getData(newParentId)
        }
      }else {
        message.error('添加失败')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  function handleCancel() {
    if(showUpdate === 1) {
      addData.current.resetFields()
    }else if(showUpdate === 2) {
      updateData.current.resetFields()
    }
    setShowUpdate(0)
  }

  function addCategory() {
    setShowUpdate(1)
  }

  function updateCategory(e, data) {
    e.preventDefault()
    setChooseData(data)
    setShowUpdate(2)
  }

  useEffect(() => {
    if(parentId === 'string') {
      getData(parentId)
    }else {
      getData(parentId)
    }
  }, [parentId])

  return (
    <Card
      title={title}
      extra={<Button onClick={() => addCategory()} type='primary'>
        <PlusOutlined />
        添加
        </Button>}
      style={{
        width: '100%',
      }}
    >

      <Modal title="添加分类" open={showUpdate===1} onOk={handleAdd} onCancel={handleCancel}>
            <AddModal data={data} parentId={parentId} parentName={parentName} ref={addData} />
      </Modal>
      <Modal title="修改分类" open={showUpdate===2} onOk={handleUpdate} onCancel={handleCancel}>
            <UpdateModal data={chooseData} ref={updateData} />
      </Modal>
      <Table rowKey='id'
            loading={loading}
            bordered={true}
            columns={columns}
            dataSource={parentId === 'string' ? data : subData}
            pagination={{defaultPageSize:5,showQuickJumper:true}} />
    </Card>
  )
}