import React, { forwardRef } from 'react'
import { Form, Input } from 'antd'
import { useEffect } from 'react'

function UpdateModal(props, ref) {
  const [form] = Form.useForm()
  
  useEffect(() => {
    form.setFieldsValue({
      title:props.data.name
    })
  })

  return (
    <Form form={form} ref={ref}>
        <Form.Item
          name='title'
          style={{marginBottom:30,marginTop:30}}
          rules={[
            {
              required:true,
              message:'请输入分类标题'
            }
          ]}
        >
            <Input key={props.data.id} placeholder='请输入分类标题' />
        </Form.Item>
    </Form>
  )
}

export default forwardRef(UpdateModal)