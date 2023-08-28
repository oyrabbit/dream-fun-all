export default {
  path: '/user-manage',
  name: 'UserManage',
  component: () => import('/@/views/user-manage/user-manage/index.vue'),
  //   redirect: '/index',
  meta: {
    title: '用户管理',
    isLink: '',
    isHide: false,
    isKeepAlive: true,
    isAffix: false,
    isIframe: false,
    roles: ['admin'],
    icon: 'ele-User'
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
