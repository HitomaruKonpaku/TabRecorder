chrome.runtime.sendMessage(location.href)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.runtime.sendMessage(location.href)
})