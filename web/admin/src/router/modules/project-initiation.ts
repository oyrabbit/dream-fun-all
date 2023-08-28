export default {
  path: '/project-initiation',
  name: 'projectInitiation',
  component: () => import('/@/layout/routerView/parent.vue'),
  redirect: '/index',
  meta: {
    title: '项目立项',
    isLink: '',
    isHide: false,
    isKeepAlive: true,
    isAffix: false,
    isIframe: false,
    roles: ['admin'],
    icon: 'iconfont icon-xitongshezhi'
  },
  children: [
    {
      path: '/project-initiation/declare-entry',
      name: 'declareEntry',
      component: () => import('/@/views/project-initiation/declare-entry/index.vue'),
      meta: {
        title: '申报入库',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'iconfont icon-caidan'
      }
    },
    {
      path: '/project-initiation/declare-entry/add-project',
      name: 'addProject',
      component: () => import('/@/views/project-initiation/declare-entry/add-project.vue'),
      meta: {
        title: '新增项目',
        isLink: '',
        isHide: true,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'ele-ColdDrink'
      }
    },
    {
      path: '/project-initiation/project-review',
      name: 'projectReview',
      component: () => import('/@/views/project-initiation/project-review/index.vue'),
      meta: {
        title: '项目审核',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'iconfont icon-icon-'
      }
    },
    {
      path: '/project-initiation/approval-supervision',
      name: 'approvalSupervision',
      component: () => import('/@/views/project-initiation/approval-supervision/index.vue'),
      meta: {
        title: '审批监管',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'ele-OfficeBuilding'
      }
    },
    {
      path: '/project-initiation/detail',
      name: 'projectInitiationDetail',
      component: () => import('/@/views/project-initiation/detail/index.vue'),
      meta: {
        title: '查看详情',
        isLink: '',
        isHide: true,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'ele-SetUp'
      }
    }
  ]
}
