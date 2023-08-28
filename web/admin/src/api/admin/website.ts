import request from '/@/utils/request'

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getUsers 获取用户列表
 */
export function useWebsiteApi() {
  return {
    getWebsite: (data: EmptyObjectType) => {
      return request({
        url: `/api/admin/website?pagesize=${data.pagesize}&pagenum=${data.pagenum}&webname=${data.webname}`,
        method: 'get'
      })
    },
    editWebsite: (id: number, data: EmptyObjectType) => {
      return request({
        url: `/api/website/${id}`,
        method: 'put',
        data
      })
    },
    delWebsite: (id: number) => {
      return request({
        url: `/api/website/${id}`,
        method: 'DELETE'
      })
    },
    addWebsite: (data: EmptyObjectType) => {
      return request({
        url: `/api/website/add`,
        method: 'post',
        data
      })
    }
  }
}
