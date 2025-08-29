document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlOutput = document.getElementById('urlOutput');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const notification = document.getElementById('notification');

    // Show notification
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Encode URL
    encodeBtn.addEventListener('click', function () {
        const inputValue = urlInput.value.trim();
        if (!inputValue) {
            showNotification('Please enter a URL to encode', 'error');
            return;
        }

        try {
            const encoded = encodeURIComponent(inputValue);
            urlOutput.value = encoded;
            showNotification('URL encoded successfully!');
        } catch (error) {
            showNotification('Error encoding URL', 'error');
        }
    });

    // Decode URL
    decodeBtn.addEventListener('click', function () {
        const inputValue = urlInput.value.trim();
        if (!inputValue) {
            showNotification('Please enter a URL to decode', 'error');
            return;
        }

        try {
            const decoded = decodeURIComponent(inputValue);
            urlOutput.value = decoded;
            showNotification('URL decoded successfully!');
        } catch (error) {
            showNotification('Error decoding URL - invalid format', 'error');
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function () {
        const outputValue = urlOutput.value.trim();
        if (!outputValue) {
            showNotification('No content to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(outputValue).then(function () {
            showNotification('Copied to clipboard!');
        }).catch(function () {
            // Fallback for older browsers
            urlOutput.select();
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        });
    });

    // Clear inputs
    clearBtn.addEventListener('click', function () {
        urlInput.value = '';
        urlOutput.value = '';
        urlInput.focus();
        showNotification('Fields cleared');
    });

    // Auto-focus input on popup open
    urlInput.focus();

    // Handle Enter key for encoding
    urlInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            encodeBtn.click();
        }
    });
});