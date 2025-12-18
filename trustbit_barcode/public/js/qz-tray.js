/**
 * QZ Tray Library Loader
 * 
 * This script loads the QZ Tray library from CDN.
 * QZ Tray enables direct printing to thermal printers from web browsers.
 * 
 * For production use, you can replace this file with the full QZ Tray library
 * downloaded from: https://qz.io/download/
 * 
 * Or copy from: /frappe-bench/apps/frappe/node_modules/qz-tray/qz-tray.js
 */

(function() {
    // Check if QZ is already loaded
    if (typeof qz !== "undefined") {
        console.log("QZ Tray: Already loaded");
        return;
    }
    
    // Load QZ Tray from CDN
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.min.js";
    script.async = true;
    
    script.onload = function() {
        console.log("QZ Tray: Library loaded from CDN");
        
        // Optional: Set up certificate for production
        // qz.security.setCertificatePromise(function(resolve, reject) {
        //     resolve("-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----");
        // });
        
        // Optional: Set up signature for production
        // qz.security.setSignatureAlgorithm("SHA512");
        // qz.security.setSignaturePromise(function(toSign) {
        //     return function(resolve, reject) {
        //         // Sign the data
        //         resolve(signedData);
        //     };
        // });
    };
    
    script.onerror = function() {
        console.error("QZ Tray: Failed to load from CDN. Trying local fallback...");
        
        // Try to load from local Frappe installation
        var fallbackScript = document.createElement("script");
        fallbackScript.src = "/assets/frappe/node_modules/qz-tray/qz-tray.js";
        
        fallbackScript.onload = function() {
            console.log("QZ Tray: Library loaded from local fallback");
        };
        
        fallbackScript.onerror = function() {
            console.error("QZ Tray: Failed to load library. Please install QZ Tray manually.");
            console.error("Download from: https://qz.io/download/");
        };
        
        document.head.appendChild(fallbackScript);
    };
    
    document.head.appendChild(script);
})();
