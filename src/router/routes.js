const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Today = (resolve) => {
  import('components/today/today').then((module) => {
    resolve(module)
  })
}

const Task = (resolve) => {
  import('components/task/task').then((module) => {
    resolve(module)
  })
}

const PlanDetail = (resolve) => {
  import('components/plan-detail/plan-detail').then((module) => {
    resolve(module)
  })
}

const MatterDetail = (resolve) => {
  import('components/matter-detail/matter-detail').then((module) => {
    resolve(module)
  })
}

const Project = (resolve) => {
  import('components/project/project').then((module) => {
    resolve(module)
  })
}

const ProjectDetail = (resolve) => {
  import('components/project-detail/project-detail').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const Play = (resolve) => {
  import('components/play/play').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

const Test = (resolve) => {
  import('components/test/test').then((module) => {
    resolve(module)
  })
}

const Chart = (resolve) => {
  import('components/chart/chart').then((module) => {
    resolve(module)
  })
}

const Add = (resolve) => {
  import('components/add/add').then((module) => {
    resolve(module)
  })
}

const State = (resolve) => {
  import('base/state/state').then((module) => {
    resolve(module)
  })
}

const StateCart = (resolve) => {
  import('components/state-cart/state-cart').then((module) => {
    resolve(module)
  })
}

const StateTask = (resolve) => {
  import('components/state-task/state-task').then((module) => {
    resolve(module)
  })
}

export default [
  {
    path: '/',
    redirect: '/today'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    name: 'today',
    path: '/today',
    component: Today,
    children: [
      {
        name: 'planDetail',
        path: 'detail',
        component: PlanDetail,
        props: true
      },
      {
        // name: 'play',
        path: 'play',
        component: Play,
        props: true
      }
    ]
  },
  // {
  //   path: '/plan',
  //   component: Plan,
  //   children: [
  //     {
  //       name: 'planDetail',
  //       path: 'detail',
  //       component: PlanDetail,
  //       props: true
  //     },
  //     {
  //       name: 'play',
  //       path: 'play',
  //       component: Play,
  //       props: true
  //     }
  //   ]
  // },
  {
    name: 'task',
    path: '/task',
    component: Task,
    children: [
      {
        // name: 'play',
        path: 'play',
        component: Play,
        props: true
      }
    ]
  },
  {
    name: 'matterDetail',
    path: '/matter-detail',
    component: MatterDetail,
    props: true
  },
  {
    path: '/project',
    component: Project
  },
  {
    name: 'projectDetail',
    path: '/project-detail',
    component: ProjectDetail,
    props: true
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/user',
    component: UserCenter
  },
  {
    name: 'state',
    path: '/state',
    component: State,
    props: true
  },
  {
    name: 'stateCart',
    path: '/state-cart',
    component: StateCart
  },
  {
    name: 'stateTask',
    path: '/state-task',
    component: StateTask
  },
  {
    name: 'add',
    path: '/add',
    component: Add,
    props: true
  },
  {
    path: '/test',
    component: Test
  },
  {
    name: 'play',
    path: '/play',
    component: Play
  },
  {
    path: '/chart',
    component: Chart
  },
  {
    path: '/api',
    children: [
      {
        path: '/plans'
      }
    ]
  }
]
