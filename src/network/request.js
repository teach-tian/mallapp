import axios from 'axios'

// 别人的接口
export function request(config){
  const instance = axios.create({
    baseURL:'http://123.207.32.32:8000/api/m3',
    timeout:10000
  })
//请求拦截
instance.interceptors.request.use(config => {
  return config
},err =>{
  console.log(err);
})
//响应拦截
instance.interceptors.response.use(res =>{
  return res.data
},err =>{
  console.log(err);
})
//发送真正的网络请求
return instance(config)
}



