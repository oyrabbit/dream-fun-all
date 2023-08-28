import request from '/@/utils/request'

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getUsers 获取用户列表
 */
export function useFCateApi() {
  return {
    getFCate: (data: EmptyObjectType) => {
      return request({
        url: `/api/admin/f_category?pagesize=${data.pagesize}&pagenum=${data.pagenum}&fcatename=${data.fcatename}`,
        method: 'get'
      })
    },
    changePwd: (id: number, data: EmptyObjectType) => {
      return request({
        url: `/api/admin/changepw/${id}`,
        method: 'put',
        data
      })
    },
    editFCate: (id: number, data: EmptyObjectType) => {
      return request({
        url: `/api/f_category/${id}`,
        method: 'put',
        data
      })
    },
    delFCate: (id: number) => {
      return request({
        url: `/api/f_category/${id}`,
        method: 'DELETE'
      })
    },
    addFCate: (data: EmptyObjectType) => {
      return request({
        url: `/api/f_category/add`,
        method: 'post',
        data
      })
    }
  }
}
