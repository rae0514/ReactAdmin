import React, { forwardRef } from 'react'
import { Form, Input } from 'antd'

function AddModal(_, ref) {
  
  return (
    <Form ref={ref}>
        <Form.Item
          label='角色名称'
          name='name'
          style={{marginTop:30}}
        >
            <Input />
        </Form.Item>
    </Form>
  )
}

export default forwardRef(AddModal)