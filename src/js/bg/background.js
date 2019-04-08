(function () {
  'use strict'

  const _config = window.TabRecorder.config
  const _records = window.TabRecorder.records

  record()
  setInterval(record, _config.recordInterval * 1000)

  function record() {
    _records.splice(0, _records.length)
    loadStorage()
    chrome.tabs.query({}, tabs => {
      const windowIdSet = new Set()
      const data = tabs
        .sort((a, b) => a.windowId - b.windowId || a.index - b.index)
        .map(v => {
          windowIdSet.add(v.windowId)
          return [
            // window id
            windowIdSet.size - 1,
            // window index
            v.index,
            // title
            v.title,
            // url
            v.url
          ]
        })
      // Add new record
      _records.unshift({ time: Date.now(), tabs: data })
      // Clear records
      while (_records.length > _config.recordMaxCount || JSON.stringify(_records).length > _config.localStorageLimitSize) {
        _records.pop()
      }
      // Save
      saveStorage()
    })
  }

  function loadStorage() {
    const data = JSON.parse(localStorage.getItem(_config.localStorageKey))
    const arr = data || []
    _records.push(...arr)
  }

  function saveStorage() {
    localStorage.setItem(_config.localStorageKey, JSON.stringify(_records))
  }

})()

chrome.runtime.onMessage.addListener((message) => {
  console.log(message)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo && changeInfo.status === 'loading' && changeInfo.url) {
    console.log(changeInfo.url)
  }
})

// eslint-disable-next-line no-unused-vars
function showTabRecorderData() {
  const config = { ...window.TabRecorder.config }
  const records = [...window.TabRecorder.records].map(v => {
    v.time = new Date(v.time).toLocaleDateString(config.localeCode, config.dateConfig)
    return v
  })
  console.log(records)
}
