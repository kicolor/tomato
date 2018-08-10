import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, target) {
  return list.findIndex((item) => {
    return item.id === target.id
  })
}

function findIndexOfId(list, targetId) {
  return list.findIndex((item) => {
    return item.id === targetId
  })
}

function deepCopy(o) {
  if (o instanceof Array) {
    let n = []
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i])
    }
    return n
  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = deepCopy(o[i])
    }
    return n
  } else {
    return o
  }
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const selectPlan = function ({commit, state}, plan) {
  let restTomato = {
    desc: '休息'
  }
  let tomatoList = Array.of(plan, restTomato)
  commit(types.SET_TOMATO_LIST, tomatoList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAY_MODE, playMode.playing)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// export const insertPlan = function ({commit, state}, plan) {
//   let planList = state.planList.slice()
//   planList.push(plan)
//   commit(types.SET_PLAN_LIST, planList)
// }

export const insertPlan = function ({commit, state}, plan) {
  let taskList = deepCopy(state.taskList)
  let taskIndex = findIndexOfId(taskList, plan.matter)
  let planList = taskList[taskIndex].plan
  planList.push(plan)
  commit(types.SET_TASK_LIST, taskList)
}

// export const modifyPlan = function ({commit, state}, plan) {
//   let planList = state.planList.slice()
//   let index = findIndex(planList, plan)
//   plan = Object.assign({}, planList[index], plan)
//   planList.splice(index, 1, plan)
//   commit(types.SET_PLAN_LIST, planList)
// }

export const modifyPlan = function ({commit, state}, plan) {
  let taskList = deepCopy(state.taskList)
  let taskIndex = findIndexOfId(taskList, plan.matter)
  let planList = taskList[taskIndex].plan
  let planIndex = findIndexOfId(planList, plan.id)
  planList.splice(planIndex, 1, plan)
  commit(types.SET_TASK_LIST, taskList)
}

export const deletePlan = function ({commit, state}, plan) {

}

export const inactivateTask = function ({commit, state}, taskId) {
  let taskList = state.taskList.slice()
  let index = findIndexOfId(taskList, taskId)
  taskList.splice(index, 1)
  commit(types.SET_TASK_LIST, taskList)
}

export const insertTask = function ({commit, state}, task) {
  let taskList = state.taskList.slice()
  taskList.push(task)
  commit(types.SET_TASK_LIST, taskList)
}

export const modifyTask = function ({commit, state}, task) {
  let taskList = state.taskList.slice()
  let index = findIndex(taskList, task)
  task = Object.assign({}, taskList[index], task)
  taskList.splice(index, 1, task)
  commit(types.SET_TASK_LIST, taskList)
}

export const deleteTaskArr = function ({commit, state}, taskArr) {
  let taskList = state.taskList.slice()
  taskArr.map(item => {
    let index = findIndex(taskList, item)
    taskList.splice(index, 1)
  })
  commit(types.SET_TASK_LIST, taskList)
}

export const changeMatterAttribute = function ({commit, state}, {projectId, matterId, task = {}}) {
  console.log('changeMatterAttribute')
  let projectList = deepCopy(state.projectList)
  let projectIndex = findIndexOfId(projectList, projectId)
  let matterList = projectList[projectIndex].matter
  let matterIndex = findIndexOfId(matterList, matterId)
  if (Object.keys(task).length) {
    let matter = matterList[matterIndex]
    if (matter.project === task.project) {
      matterList.splice(matterIndex, 1, task)
    } else {
      matterList.splice(matterIndex, 1)
      projectIndex = findIndexOfId(projectList, task.project)
      matterList = projectList[projectIndex].matter
      matterList.push(task)
    }
  } else {
    matterList.splice(matterIndex, 1)
  }
  commit(types.SET_PROJECT_LIST, projectList)
}

export const insertMatter = function ({commit, state}, {project, matter}) {
  let projectList = deepCopy(state.projectList)
  let index = findIndex(projectList, project)
  let pro = projectList[index]
  projectList[index].matter.push(matter)
  projectList[index] = Object.assign({}, pro, project)
  commit(types.SET_PROJECT_LIST, projectList)
}

export const insertProject = function ({commit, state}, project) {
  let projectList = state.projectList.slice()
  projectList.unshift(project)
  commit(types.SET_PROJECT_LIST, projectList)
}

export const deleteProject = function ({commit, state}, projectId) {
  let projectList = state.projectList.slice()
  let index = findIndexOfId(projectList, projectId)
  projectList.splice(index, 1)
  commit(types.SET_PROJECT_LIST, projectList)
}

export const archiveProject = function ({commit, state}, {projectId, archiveArr}) {
  let projectList = deepCopy(state.projectList)
  let index = findIndexOfId(projectList, projectId)
  let project = projectList[index]
  project.archive = true
  archiveArr.map(item => {
    let i = findIndex(project.matter, item)
    project.matter[i].archive = true
  })
  commit(types.SET_PROJECT_LIST, projectList)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
