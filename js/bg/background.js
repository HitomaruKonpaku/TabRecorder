const SETTINGS = {
    RECORD_INTERVAL: 120,
    RECORD_MAX_COUNT: 1000,
    LOCAL_STORAGE_ID: 'tr',
    LOCAL_STORAGE_LIMIT: 5241887,
    LOCALE_CODE: 'vi',
    DATE_OPTIONS: {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    },
}

function tabHistory() {
    const records = tabLoad()
    const json = JSON.stringify(records)
    const newRecords = JSON.parse(json, (k, v) => k === 'time' ?
        new Date(v).toLocaleDateString(SETTINGS.LOCALE_CODE, SETTINGS.DATE_OPTIONS) : v)
    console.log(newRecords)
}

function tabLoad() {
    return JSON.parse(localStorage.getItem(SETTINGS.LOCAL_STORAGE_ID))
}

function tabSave(data) {
    let records = []
    const oldRecords = tabLoad()
    if (oldRecords !== null) records = records.concat(oldRecords)
    records.unshift({
        time: Date.now(),
        tabs: data,
    })
    while (records.length > SETTINGS.RECORD_MAX_COUNT
        || JSON.stringify(records).length > SETTINGS.LOCAL_STORAGE_LIMIT) {
        records.pop()
    }
    localStorage.setItem(SETTINGS.LOCAL_STORAGE_ID, JSON.stringify(records))
}

function tabRecord() {
    chrome.tabs.query({}, tabs => {
        const data = tabs
            .map(v => {
                return {
                    // tab id
                    id: v.id,
                    // window id
                    wid: v.windowId,
                    // title
                    title: v.title,
                    // url
                    url: v.url,
                }
            })
            .sort((a, b) => a.wid != b.wid
                ? a.wid - b.wid
                : a.id - b.id)
        tabSave(data)
    })
}

// Record on load
tabRecord()

// Record after every interval
setInterval(() => tabRecord(), Number(SETTINGS.RECORD_INTERVAL) * 1000)
