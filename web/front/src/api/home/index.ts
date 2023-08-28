// 权限问题后期增加
import request from '/@/utils/http/request';
// import axios from 'axios';
enum URL {
  allCate = '/api/category/all',
  defaultWebsite = '/api/website/default/',
  logout = '/user/logout',
  profile = '/user/profile',
}
// interface LoginRes {
//   token: string;
// }
// interface AllCateRes {
//   data: Object[];
//   message: string;
//   status: number;
// }

// export interface LoginData {
//   username: string;
//   password: string;
// }

const getUserCategory = () => {
  return request({
    url: `/api/user/category`,
    method: 'get',
  });
};

const getUserWebsite = () => {
  return request({
    url: `/api/user/website`,
    method: 'get',
  });
};

const editCustomCate = (id: number, data: object) => {
  return request({
    url: `/api/user/category/${id}`,
    method: 'put',
    data,
  });
};

const deleteCustomCate = (id: number) => {
  return request({
    url: `/api/user/category/${id}`,
    method: 'delete',
  });
};

const addCustomCate = (username: string, data: object) => {
  return request({
    url: `/api/user/category/add/${username}`,
    method: 'post',
    data,
  });
};

const addCustomWebsite = (username: string, data: object) => {
  return request({
    url: `/api/user/website/add/${username}`,
    method: 'post',
    data,
  });
};

const editCustomWebsite = (id: number, username: string, data: object) => {
  return request({
    url: `/api/user/website/${id}/${username}`,
    method: 'put',
    data,
  });
};

const delCustomWebsite = (id: number, username: string) => {
  return request({
    url: `/api/user/website/${id}/${username}`,
    method: 'delete',
  });
};

const getAllCate = () => {
  return request({
    url: URL.allCate,
    method: 'get',
  });
};

const getDefaultWebsite = (id: number) => {
  return request({
    url: `/api/website/default/${id}`,
    method: 'get',
  });
};

// const getAllCate = async () => get<AllCateRes>({ url: URL.allCate });
// const getDefaultWebsite = async (id: number) => get({ url: `/api/website/default/${id}` });
// const getUserWebsite = async (id: number) => get({ url: `/api/user/website?userId=${id}` });
// const login = async (data: LoginData) => post<any>({ url: URL.login, data });
// const logout = async () => post<LoginRes>({ url: URL.logout });
export {
  getAllCate,
  getDefaultWebsite,
  getUserCategory,
  getUserWebsite,
  editCustomCate,
  deleteCustomCate,
  addCustomCate,
  addCustomWebsite,
  editCustomWebsite,
  delCustomWebsite,
};
