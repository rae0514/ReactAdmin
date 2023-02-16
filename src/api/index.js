import ajax from "./ajax";

export const reqLogin = (username, password) => ajax('http://localhost:3000/api1/api/user/login', {name:username, password}, 'POST')

export const reqCategory = (parentId) => ajax('http://localhost:3000/api1/api/category/list/'+parentId, {})

export const reqUpdateCategory = (id, name) => ajax('http://localhost:3000/api1/api/category/update', {id,name},'PUT')

export const reqAddCategory = (name, newParentId, parentName) => ajax('http://localhost:3000/api1/api/category/add', {name, parentId:newParentId, parentName}, 'POST')

export const reqProduct = (pageNum, pageSize) => ajax('http://localhost:3000/api1/api/products/list', {pageNum, pageSize}, 'POST')

export const reqProductByName = (pageNum, name, pageSize) => ajax('http://localhost:3000/api1/api/products/searchByName', {pageNum, name, pageSize})

export const reqProductByDesc = (desc, pageSize, pageNum) => ajax('http://localhost:3000/api1/api/products/searchByDesc/'+desc+'/'+pageNum+'/'+pageSize, {})

export const reqSearchCategory = (categoryId) => ajax('http://localhost:3000/api1/api/category/findCategoryById/'+categoryId, {})

export const reqChangeStatus = (id, status) => ajax('http://localhost:3000/api1/api/products/updateStatus/'+id, {status}, 'PUT')

export const reqAddProduct = (productInfo) => ajax('http://localhost:3000/api1/api/products/addProduct', productInfo, 'POST')

export const reqUpdateProduct = (id, productInfo) => ajax('http://localhost:3000/api1/api/products/updateProduct/' + id, productInfo, 'PUT')

export const reqRoles = () => ajax('http://localhost:3000/api1/api/role/getRoles', {})

export const reqAddRole = (name) => ajax('http://localhost:3000/api1/api/role/createRoleByName', name, 'POST')

export const reqAddAuth = (id, role) => ajax('http://localhost:3000/api1/api/role/updateRole/' + id, role, 'PUT')

export const reqUsers = () => ajax('http://localhost:3000/api1/api/user/getUsers', {})

export const reqDeleteUsers = (id) => ajax('http://localhost:3000/api1/api/user/delete/' + id, {id}, 'DELETE') 

export const reqAddUser = (user) => ajax('http://localhost:3000/api1/api/user/add', user, 'POST')

export const reqUpdateUser = (id, user) => ajax('http://localhost:3000/api1/api/user/update/' + id, user, 'PUT')

export const reqGetRole = (id) => ajax('http://localhost:3000/api1/api/role/get/' + id, {id})

export const reqWeather = (city) => {
    const url = 'https://restapi.amap.com/v3/weather/weatherInfo?key=1c2089ba3e557183105c24838f92c187&city=' + city
    return ajax(url)
}