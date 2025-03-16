import request from '@/api/request';

/**
 * 文件上传函数
 * @param {FormData} formData - 包含文件的 FormData 对象
 * @returns {Promise} - 返回一个 Promise 对象
 */
/**
 * 获取初始化需求数据接口
 * @param {Object} [params] - 分页参数 { page: number, limit: number, sortBy: string, order: 'asc'|'desc' }
 * @returns {Promise<{code: number, data: Array<{id: number, name: string, description: string, requirements: string}>}>}
 */
export function fetchInitialReqs(params = {}) {
    return request({
        url: '/api/get_reqs',
        method: 'GET',
        params: {},
    });
}

// src/api/llm.js
export function saveReqs(reqsData) {
    return request({
        url: "/api/save_reqs", // 后端接口路径
        method: "post",
        data: {
            reqs: reqsData, // 接收前端传入的需求数组
        },
    });
}
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
// 获取初始化角色数据
export function fetchInitialActors() {
    return request({
        url: '/api/get_actors',
        method: 'GET'
    });
}
// 删除角色
export function deleteActor(id) {
    return request({
        url: `/api/actors/${id}`,
        method: 'delete'
    });
}
// 新增保存角色接口
export const saveActors = (actors) => {
    return request({
        url: '/api/save_actors',
        method: 'post',
        data: actors.map(actor => ({
            name: actor.actor_name,
            description: actor.function_req
        }))
    })
}
// src/api/llm.js
export function getActors(data) {
    return request({
        url: '/generate_actors',
        method: 'post',
        data: {
            requirements_list: data.requirements.map(req => ({
                req_id: req.id,
                description: req.description,
                requirements: req.requirements
            }))
        }
    })
}

export function fetchInitialUseCases() {
    return request({
        url: '/api/get_usecases',
        method: 'GET'
    })
}


export const generateUseCases = (params) => {
    return request({
        url: '/api/gen_usecase',
        method: 'post',
        data: params
    })
}

// 删除用例
export const deleteUseCase = (id) => {
    return request({
        url: `/api/usecases/${id}`,
        method: 'delete'
    })
}

export const saveUseCases = (usecases) => {
    return request({
        url: '/api/save_usecases',
        method: 'post',
        data: {
            usecases: usecases.map(uc => ({
                reqid: uc.reqId,
                actorid: uc.actorId,
                title: uc.title,
                description: uc.description || '',
                preconditions: uc.preconditions || '',
                postconditions: uc.postconditions || '',
            }))
        }
    })
}

// 修改后（批量生成）
export const batchGenerateScenarios = (usecaseIds) => {
    return request({
        url: '/api/usecases/batch-generate-scenarios',
        method: 'post',
        data: { usecase_ids: usecaseIds }
    })
}

// 新增场景步骤保存接口
export const batchSaveScenarioSteps = (data) => {
    return request({
        url: '/api/save_scenario_steps',
        method: 'post',
        data: {
            steps: data.steps
        }
    })
}

export const fetchInitialCaseSteps = () => {
    return request({
        url: '/api/get_scenario_steps',
        method: 'GET'
    })
}

// 生成系统顺序图接口
export const generateSequenceDiagram = (data) => {
    return request({
        url: '/api/generate_sequence_diagram',
        method: 'post',
        data: {
            useCaseId: data.useCaseId,
            steps: data.steps
        }
    })
}