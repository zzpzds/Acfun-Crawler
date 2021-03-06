const moment = require('moment')

let allArticleList = require('../data/article-list.json')

module.exports = (services) => ({
  /**
   * 获取各个分类类型文章数量
   */
  getArticleTypeProportion: async (ctx) => {
    let requestData = await services.request.bodyParse(ctx)
    let articleList = [...allArticleList]
    if (requestData.amount) {
      articleList = articleList.slice(0, requestData.amount)
    }
    let resultMap = new Map()
    articleList.forEach(item => {
      let type = item.channel_name
      if (resultMap.has(type)) {
        let prevent = resultMap.get(type)
        resultMap.set(type, prevent + 1)
      } else {
        resultMap.set(type, 1)
      }
    })
    let resultList = []
    for (const item of resultMap.entries()) {
      let obj = {
        type: item[0],
        proportion: item[1],
      }
      resultList.push(obj)
    }
    services.response.json(ctx, {stat: 'ok', data: resultList})
  },

  /**
   * 每天不同时间段发稿数量
   */
  getArticleAmountByDateArea: async (ctx) => {
    let requestData = await services.request.bodyParse(ctx)
    let articleList = [...allArticleList]
    if (requestData.amount) {
      articleList = articleList.slice(0, requestData.amount)
    }
    let valueMap = {}
    for (const article of articleList) {
      let chour = moment(article.contribute_time).format('HH')
      if (valueMap.hasOwnProperty(chour)) {
        let preValue = valueMap[chour]
        valueMap[chour] = preValue + 1
      } else {
        valueMap[chour] = 1
      }
    }
    let hourList = Object.keys(valueMap)
    hourList = hourList.sort((a, b) => (
      Number(a) - Number(b)
    ))
    let amountList = []
    hourList.forEach(key => {
      amountList.push(valueMap[key])
    })
    services.response.json(ctx, {stat: 'ok', data: {hourList, amountList}})
  },

  /**
   * 香蕉数量区间文章数 
   */
  getArticleAmountByBanana: async (ctx) => {
    let requestData = await services.request.bodyParse(ctx)
    let articleList = [...allArticleList]
    if (requestData.amount) {
      articleList = articleList.slice(0, requestData.amount)
    }
    const bananaAmountAreaList = [[0, 4], [5, 9], [10, 19], [20, 39], [40, 59], [60, 79], [80, 99], [100, 1000]]
    let proportionValueList = (new Array(bananaAmountAreaList.length)).fill(0)
    for (const article of articleList) {
      let comment = article.banana_count
      let areaIndex = bananaAmountAreaList.findIndex(item => (comment >= item[0] && comment <= item[1]))
      proportionValueList[areaIndex] += 1
    }
    services.response.json(ctx, {stat: 'ok', data: {areaList: bananaAmountAreaList, amountList: proportionValueList}})
  }
}) 