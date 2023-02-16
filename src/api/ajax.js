import axios from "axios";
import { message } from "antd";

export default function ajax(url, data={}, type='GET') {
    return new Promise((resolve, reject) => {
        let promise
        if(type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        }else if(type === 'POST') {
            if(typeof(data) === 'string') {
                promise = axios({
                    method: 'POST',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
            }else {
                promise = axios.post(url, data)
            }
        }else if(type === 'PUT') {
            promise = axios.put(url, data)
        }else {
            promise = axios.delete(url, data)
        }
        
        promise.then(response => {
            resolve(response)
        }).catch(error => {
            message.error('请求出错了,' + error.message)
        })
    })
}