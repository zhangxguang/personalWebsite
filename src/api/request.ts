import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',  // 从环境变量获取基础URL
  timeout: 15000,  // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 例如：添加token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { data } = response;
    
    // 这里可以根据后端的数据结构进行适当的处理
    if (data.code === 200) {
      return data.data;
    }
    
    // 处理其他状态码
    console.warn(`API返回非200状态码:`, data);
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权处理
          console.error('未授权，请重新登录');
          // 可以在这里处理登出逻辑
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`连接错误 ${error.response.status}`);
      }
    } else {
      console.error('网络连接异常,请稍后重试!');
    }
    return Promise.reject(error);
  }
);

export default request;