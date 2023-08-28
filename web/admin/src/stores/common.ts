import { defineStore } from 'pinia'
import { useMenuApi } from '/@/api/menu/index'

// 引入 api 请求接口
const menuApi = useMenuApi()
/**
 * 全局数据
 * @methods getNewsNum 获取对应菜单项消息数
 */
export const useCommon = defineStore('common', {
  state: (): CommonState => ({
    menuNews: []
  }),
  actions: {
    async getMenuNews() {
      this.menuNews = [
        {
          name: 'factorGuarantee',
          number: 1
        }
      ]
      const res = await menuApi.getTodoNumber()
      for (let k in res) {
        switch (k) {
          case 'beiducha': //被督察单位
            let SupervisedUnitSum = 0
            for (let key in res[k]) {
              res[k][key] = Number(res[k][key])
              SupervisedUnitSum += res[k][key]
            }
            this.setMenuNews('SupervisedUnit', SupervisedUnitSum)
            this.setMenuNews('AcceptSupervision', res[k]?.jieshou)
            this.setMenuNews(
              'RectificationFeedback',
              res[k]?.daifankui + res[k]?.daiqianshou + res[k]?.yiyvjing + res[k]?.yiyvqi
            )
            break
          case 'ducha': //督察单位
            let supervisionUnitSum = 0
            for (let key in res[k]) {
              res[k][key] = Number(res[k][key])
              supervisionUnitSum += res[k][key]
            }
            this.setMenuNews('supervisionUnit', supervisionUnitSum)
            this.setMenuNews('ReportUpload', res[k]?.baogao)
            this.setMenuNews('PendingApproval', res[k]?.daishenpi + res[k]?.jiaru + res[k]?.yanqi)
            break
          case 'niandu': //年度计划
            let YearlyPlanSum = 0
            for (let key in res[k]) {
              res[k][key] = Number(res[k][key])
              YearlyPlanSum += res[k][key]
            }
            this.setMenuNews('YearlyPlan', YearlyPlanSum)
            this.setMenuNews('planCoordination', res[k]?.shenpi)
            break
          case 'quanhui': //全会目标
            let MeetingObjectivesSum = 0
            for (let key in res[k]) {
              res[k][key] = Number(res[k][key])
              MeetingObjectivesSum += res[k][key]
            }
            this.setMenuNews('MeetingObjectives', MeetingObjectivesSum)
            this.setMenuNews('TaskList', res[k]?.shenpi)
            this.setMenuNews('ProgressReview', res[k]?.shenhe)
            this.setMenuNews('HandlingFeedback2', res[k]?.fankui)
            break
          case 'zhuanxiang': //日常督办
            let DailySupervisionSum = 0
            for (let key in res[k]) {
              res[k][key] = Number(res[k][key])
              DailySupervisionSum += res[k][key]
            }
            this.setMenuNews('DailySupervision', DailySupervisionSum)
            this.setMenuNews('SupervisionList', res[k]?.duban)
            this.setMenuNews('HandlingFeedback', res[k]?.fankui)
            break
        }
      }
    },
    setMenuNews(name: string, number: number) {
      this.menuNews.push({
        name: name,
        number: number
      })
    }
  },
  getters: {
    getNewsNum: (state) => {
      const number = (name: string) =>
        state.menuNews.find((item) => item.name === name && item.number !== 0)?.number
      return number
    }
  }
})
