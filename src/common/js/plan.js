const DEFAULT_PROJECT = '默认项目'

export default class Plan {
  constructor ({id, project = DEFAULT_PROJECT, desc, key, complete = false, fulfill = 0, predict, today = false} = {}) {
    this.id = id
    this.project = project
    this.desc = desc
    this.key = key
    this.complete = complete
    this.fulfill = fulfill
    this.predict = predict
    this.today = today
  }
}
