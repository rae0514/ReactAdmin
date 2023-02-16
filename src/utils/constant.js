import {
    MailOutlined,
    PieChartOutlined,
  } from '@ant-design/icons'

export const PAGE_SIZE = 3

export const menuList = [
    {
        label: '首页',
        key: '/home',
        icon: <PieChartOutlined />
    },
    {
        label: '商品',
        key: 'products',
        icon: <MailOutlined />,
        children: [
            {
                label: '品类管理',
                key: '/products/category'
            },
            {
                label: '商品管理',
                key: '/products/product'
            }
        ]
    },
    {
        label: '用户管理',
        key: '/user',
        icon: <PieChartOutlined />
    },
    {
        label: '角色管理',
        key: '/role',
        icon: <PieChartOutlined />
    },
    {
        label: '图形图标',
        key: 'charts',
        icon: <MailOutlined />,
        children: [
            {
                label: '柱形图',
                key: '/charts/bar'
            },
            {
                label: '折线图',
                key: '/charts/line'
            },
            {
                label: '饼图',
                key: '/charts/pie'
            }
        ]
    }
]