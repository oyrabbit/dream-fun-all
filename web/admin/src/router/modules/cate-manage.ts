export default {
  path: '/cate-manage',
  name: 'CateManage',
  component: () => import('/@/layout/routerView/parent.vue'),
  //   redirect: '/index',
  meta: {
    title: '分类管理',
    isLink: '',
    isHide: false,
    isKeepAlive: true,
    isAffix: false,
    isIframe: false,
    roles: ['admin'],
    icon: 'ele-Folder'
  },
  children: [
    {
      path: '/cate-manage/fcates-manage',
      name: 'FCatesManage',
      component: () => import('/@/views/cate-manage/fcates-manage/index.vue'),
      meta: {
        title: '大分类管理',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'ele-FolderOpened'
      }
    },
    {
      path: '/cate-manage/cates-manage',
      name: 'CatesManage',
      component: () => import('/@/views/cate-manage/cates-manage/index.vue'),
      meta: {
        title: '小分类管理',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'ele-FolderOpened'
      }
    }
  ]
}
