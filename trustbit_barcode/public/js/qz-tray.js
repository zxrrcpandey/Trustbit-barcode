/**
 * QZ Tray Library Loader
 * Loads QZ Tray from CDN for raw printing support
 */
(function() {
    if (typeof qz !== "undefined") {
        console.log("QZ Tray: Already loaded");
        return;
    }
    
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.min.js";
    script.async = true;
    
    script.onload = function() {
        console.log("QZ Tray: Loaded from CDN");
    };
    
    script.onerror = function() {
        console.error("QZ Tray: Failed to load. Download from https://qz.io/download/");
    };
    
    document.head.appendChild(script);
})();
