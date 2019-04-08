(function () {
  'use strict'

  const config = {
    recordInterval: 120,
    recordMaxCount: 9999,
    localStorageKey: 'TabRecorder',
    localStorageLimitSize: 5242869,
    localeCode: 'vi',
    dateConfig: {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  }

  window.TabRecorder = {
    config,
    records: []
  }

})()
