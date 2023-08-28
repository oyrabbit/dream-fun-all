import request from '/@/utils/request'

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getUsers 获取用户列表
 */
export function useCateApi() {
  return {
    getCate: (data: EmptyObjectType) => {
      return request({
        url: `/api/admin/category?pagesize=${data.pagesize}&pagenum=${data.pagenum}&catename=${data.catename}`,
        method: 'get'
      })
    },
    getCateByfid: (fcateid: number) => {
      return request({
        url: `/api/admin/category/f?fcateid=${fcateid}`,
        method: 'get'
      })
    },
    editCate: (id: number, data: EmptyObjectType) => {
      return request({
        url: `/api/category/${id}`,
        method: 'put',
        data
      })
    },
    delCate: (id: number) => {
      return request({
        url: `/api/category/${id}`,
        method: 'DELETE'
      })
    },
    addCate: (data: EmptyObjectType) => {
      return request({
        url: `/api/category/add`,
        method: 'post',
        data
      })
    }
  }
}
