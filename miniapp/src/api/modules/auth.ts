import { get, post, put } from '../request';
import type { LoginResult, User } from '../types';

/** 7.3.1 发送验证码 */
export const sendSms = (phone: string) =>
  post<null>('/api/auth/sms/send', { phone }, { auth: false });

/** 7.3.1 注册 */
export const register = (data: { phone: string; code: string; password: string }) =>
  post<{ id: number; username: string }>('/api/auth/register', data, { auth: false });

/** 7.3.1 登录 */
export const login = (data: { phone: string; password: string }) =>
  post<LoginResult>('/api/auth/login', data, { auth: false });

/** 7.3.1 微信登录（预留） */
export const wechatLogin = (code: string) =>
  post<LoginResult>('/api/auth/wechat/login', { code }, { auth: false });

/** 7.3.1 个人信息 */
export const getProfile = () => get<User>('/api/auth/profile');

export const updateProfile = (data: Partial<User>) => put<null>('/api/auth/profile', data);
