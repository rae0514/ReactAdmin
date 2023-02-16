import Admin from '../pages/admin'
import Login from '../pages/login'
import Home from '../pages/home'
import Category from '../pages/category'
import Product from '../pages/product'
import User from '../pages/user'
import Role from '../pages/role'
import Bar from '../pages/charts/bar'
import Line from '../pages/charts/line'
import Pie from '../pages/charts/pie'
import ProductHome from '../pages/product/home'
import AddUpdate from '../pages/product/add-update'
import Detail from '../pages/product/detail'
import { Navigate } from 'react-router-dom'

export default [
    {
        path: '/',
        element: <Admin/>,
        children: [
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: 'products/category',
                element: <Category/>
            },
            {
                path: 'products/product',
                element: <Product/>,
                children: [
                    {
                        path: '',
                        element: <ProductHome/>
                    },
                    {
                        path: 'addupdate',
                        element: <AddUpdate/>
                    },
                    {
                        path: 'detail',
                        element: <Detail/>
                    }
                ]
            },
            {
                path: 'user',
                element: <User/>
            },
            {
                path: 'role',
                element: <Role/>
            },
            {
                path: 'charts/bar',
                element: <Bar/>
            },
            {
                path: 'charts/line',
                element: <Line/>
            },
            {
                path: 'charts/pie',
                element: <Pie/>
            },
            {
                path: '',
                element: <Navigate to='home'/>
            }
        ]
    },
    {
        path: '/login',
        element: <Login/>
    }
]