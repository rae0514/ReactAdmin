import React, { forwardRef, useEffect, } from 'react'
import { Form, Select, Input } from 'antd'

function AddModal(props, ref) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
        chooseParent:{value:props.parentId, label:props.parentName||'一级分类'}
    })
  })

  return (
    <Form form={form} ref={ref}>
        <div style={{marginTop:30}}>所属分类：</div>
        <Form.Item name='chooseParent'>
            <Select 
              labelInValue={true}
              >
                <Select.Option value='string'>一级分类</Select.Option>
                {
                    props.data.map(item => {
                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })
                }
            </Select>
        </Form.Item>
        <div>分类标题：</div>
        <Form.Item
          name='title'
          style={{marginBottom:30}}
          rules={[
            {
              required: true,
              message: '请输入分类标题'
            }
          ]}
        >
            <Input placeholder='请输入分类标题'/>
        </Form.Item>
    </Form>
  )
}

export default forwardRef(AddModal)