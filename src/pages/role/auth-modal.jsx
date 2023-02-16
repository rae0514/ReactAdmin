import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Form, Input, Tree } from 'antd'

function AuthModal(props, ref) {

    useImperativeHandle(ref, () => ({
        checkedKeys
    }))

    const [checkedKeys, setCheckedKeys] = useState()

    const treeData = [
    {
        title: '平台权限',
        key: 'all',
        children: [
        {
            title: '首页',
            key: '/home'
        },
        {
            title: '商品',
            key: 'products',
            children: [
            {
                title: '品类管理',
                key: '/products/category',
            },
            {
                title: '商品管理',
                key: '/products/product',
            }
            ],
        },
        {
            title: '用户管理',
            key: '/user',
        },
        {
            title: '角色管理',
            key: '/role'
        },
        {
            title: '图形图标',
            key: 'charts',
            children: [
                {
                    title: '柱形图',
                    key: '/charts/bar'
                },
                {
                    title: '折线图',
                    key: '/charts/line'
                },
                {
                    title: '饼图',
                    key: '/charts/pie'
                }
            ]
        }
        ]
    }
    ]

    function onCheck(checkedKeysValue) {
        setCheckedKeys(checkedKeysValue)
    }

  return (
    <div>
        <Form.Item
          label='角色名称'
          style={{marginTop:30}}
          labelCol={{span:5}}
          wrapperCol={{span:15}}
        >
            <Input disabled value={props.role.name} />
        </Form.Item>
        <Tree
        checkable
        treeData={treeData}
        defaultExpandAll={true}
        defaultCheckedKeys={props.role.menus === '' ? [] : props.role.menus.split(',')}
        onCheck={onCheck}
        />
    </div>
  )
}

export default forwardRef(AuthModal)