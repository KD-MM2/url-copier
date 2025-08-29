// Background service worker for URL Copier extension

// Create context menu when extension starts
chrome.runtime.onStartup.addListener(createContextMenus);
chrome.runtime.onInstalled.addListener(createContextMenus);

function createContextMenus() {
    // Remove existing menus first
    chrome.contextMenus.removeAll(() => {
        // Create parent menu
        chrome.contextMenus.create({
            id: "urlCopier",
            title: "URL Copier",
            contexts: ["link", "page"]
        });

        // Create submenu items
        chrome.contextMenus.create({
            id: "copyEncoded",
            parentId: "urlCopier",
            title: "Copy Encoded URL",
            contexts: ["link", "page"]
        });

        chrome.contextMenus.create({
            id: "copyDecoded",
            parentId: "urlCopier",
            title: "Copy Decoded URL",
            contexts: ["link", "page"]
        });
    });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Get URL - either from link or current page
    const url = info.linkUrl || tab.url;

    if (info.menuItemId === "copyEncoded") {
        const encodedUrl = encodeURIComponent(url);
        copyToClipboard(tab.id, encodedUrl, "Encoded URL copied!");
    } else if (info.menuItemId === "copyDecoded") {
        const decodedUrl = decodeURIComponent(url);
        copyToClipboard(tab.id, decodedUrl, "Decoded URL copied!");
    }
});

// Copy text to clipboard using content script
async function copyToClipboard(tabId, text, message) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (textToCopy, successMessage) => {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          `;
                    notification.textContent = successMessage;
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            },
            args: [text, message]
        });
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
}
