chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo && changeInfo.status === 'loading' && changeInfo.url) {
        chrome.tabs.sendMessage(tabId, 'ping')
    }
})