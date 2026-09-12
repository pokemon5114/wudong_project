import { BASE_URL } from '@/api/request';

/**
 * 把后端返回的相对文件路径（/uploads/... 、/banners/...）拼成可访问的绝对地址。
 *
 * 上传接口 /api/upload/image 返回的是相对路径，小程序 <image> 没有页面 origin
 * 可依托，直接用相对路径会加载失败，所以渲染前必须过这一层。
 * 已是 http(s) 的地址（如种子数据的 pexels 图）原样返回。
 */
export function fileUrl(path?: string): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path)) return path;
  return BASE_URL + path;
}
