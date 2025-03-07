import request from '@/api/request'

// 测试
export function test() {
    return request({
        url: '/test',
        method: 'get'
    })
}
// 排名前十的景点
export function getCommentsRank() {
    return request({
        url:  '/commentsRank',
        method: 'get'
    })
}

//分页获取数据
export function  tours(title,page=1,limit=10){
    return request({
        url:  '/tours',
        method: 'get',
        params: {title, page, limit}
    })
}

