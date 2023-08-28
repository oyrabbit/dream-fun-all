export default {
  path: '/website-manage',
  name: 'WensiteManage',
  component: () => import('/@/views/website-manage/website-manage/index.vue'),
  //   redirect: '/index',
  meta: {
    title: '网站管理',
    isLink: '',
    isHide: false,
    isKeepAlive: true,
    isAffix: false,
    isIframe: false,
    roles: ['admin'],
    icon: 'ele-Files'
  }
  // children: [
  //   {
  //     path: '/project-initiation/declare-entry',
  //     name: 'declareEntry',
  //     component: () => import('/@/views/project-initiation/declare-entry/index.vue'),
  //     meta: {
  //       title: '申报入库',
  //       isLink: '',
  //       isHide: false,
  //       isKeepAlive: true,
  //       isAffix: false,
  //       isIframe: false,
  //       roles: ['admin'],
  //       icon: 'iconfont icon-caidan'
  //     }
  //   },
  // ]
}
