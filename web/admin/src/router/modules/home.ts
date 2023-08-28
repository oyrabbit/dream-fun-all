export default {
  path: '/home',
  name: 'home',
  redirect: '/website-manage',
  // component: () => import('/@/views/home/index.vue'),
  meta: {
    title: '首页',
    isLink: '',
    isHide: true,
    isKeepAlive: true,
    isAffix: true,
    isIframe: false,
    roles: ['admin', 'common'],
    icon: 'iconfont icon-shouye'
  }
}
