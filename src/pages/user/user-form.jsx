import React, { forwardRef, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

function UserForm(props, ref) {

  const user = props.selectUser || {}
  const [form] = Form.useForm()

  useEffect(() => {
    if(Object.keys(user).length > 0) {
        form.setFieldsValue({
            name: user.name,
            phone: user.phone,
            email: user.email,
            roleId: user.roleId*1
        })
    }
  }) 

  return (
    <Form
        style={{marginTop:30}}
        labelCol={{span:5}}
        wrapperCol={{span:15}}
        ref={ref}
        form={form}
    >
        <Form.Item
            label='用户名：'
            name='name'
        >
            <Input placeholder='请输入用户名' />
        </Form.Item>
        {
            Object.keys(user).length > 0 ? null : (
                <Form.Item
                    label='密码：'
                    name='password'
                >
                    <Input type='password' placeholder='请输入密码' />
                </Form.Item>
            )
        }
        <Form.Item
            label='手机号：'
            name='phone'
        >
            <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item
            label='邮箱：'
            name='email'
        >
            <Input placeholder='请输入邮箱' />
        </Form.Item>
        <Form.Item
            label='角色：'
            name='roleId'
        >
            <Select placeholder='请选择角色'>
                {props.roles.map(role => <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>)}
            </Select>
        </Form.Item>
    </Form>
  )
}

export default forwardRef(UserForm)