export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList

export const taskList = state => state.taskList

export const planList = state => state.planList

// export const toamtoList = state => state.toamtoList

// export const tomatoList = (state) => {
//   let restTomato = {
//     desc: '休息'
//   }
//   let temp = []
//   state.planList.map(item => {
//     for (let i = 0; i < item.predict; i++) {
//       temp.push(item)
//       temp.push(restTomato)
//     }
//   })
//   return temp
// }

export const tomatoList = state => state.tomatoList

export const currentTomato = (state) => {
  return state.tomatoList[state.currentIndex] || {}
}
