// 权限问题后期增加
import { get, post } from '/@/utils/http/axios';
import { UserState } from '/@/store/modules/user/types';
// import axios from 'axios';
enum URL {
  login = '/api/loginfront',
  register = '/api/user/add',
  logout = '/user/logout',
  profile = '/user/profile',
}
interface LoginRes {
  token: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role: number;
}

const getUserProfile = async () => get<UserState>({ url: URL.profile });
const login = async (data: LoginData) => post<any>({ url: URL.login, data });
const register = async (data: RegisterData) => post<any>({ url: URL.register, data });
const logout = async () => post<LoginRes>({ url: URL.logout });
export { getUserProfile, logout, login, register };
