import request from '@/api/request';

/**
 * 文件上传函数
 * @param {FormData} formData - 包含文件的 FormData 对象
 * @returns {Promise} - 返回一个 Promise 对象
 */
export function uploadFile(formData) {
    return request({
        url: '/upload', // 后端文件上传接口地址
        method: 'post',
        data: formData, // 将 FormData 作为请求体发送
        headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头
        },
    });
}