import request from '/@/utils/request'

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getUsers 获取用户列表
 */
export function useUserApi() {
  return {
    getUsers: (data: EmptyObjectType) => {
      return request({
        url: `/api/admin/users?username=${data.username}&pagesize=${data.pagesize}&pagenum=${data.pagenum}`,
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
    editUser: (id: number, data: EmptyObjectType) => {
      return request({
        url: `/api/user/${id}`,
        method: 'put',
        data
      })
    },
    delUser: (id: number) => {
      return request({
        url: `/api/user/${id}`,
        method: 'DELETE'
      })
    },
    addUser: (data: EmptyObjectType) => {
      return request({
        url: `/api/user/add`,
        method: 'post',
        data
      })
    }
  }
}
