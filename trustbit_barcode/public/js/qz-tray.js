/**
 * QZ Tray Connector - Minimal loader v1.0.5
 * Loads QZ Tray library from CDN
 */

(function() {
    if (typeof qz !== 'undefined') return;
    
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.min.js';
    script.onload = function() {
        console.log('QZ Tray library loaded');
    };
    script.onerror = function() {
        console.error('Failed to load QZ Tray library');
    };
    document.head.appendChild(script);
})();
