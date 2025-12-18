/**
 * Trustbit Advance Barcode Print v1.0.0
 * Direct thermal barcode label printing from ERPNext with QZ Tray
 * 
 * Copyright (c) 2025 Trustbit
 * License: MIT
 */

// Global namespace for the barcode printing functionality
var trustbit_barcode = {
    // Configuration
    config: {
        printer_name: "Bar Code Printer TT065-50",  // Change this to match your printer name
        label_sizes: {
            "35x15": { width: 70, height: 15, gap: 3, printable_height: 10 },
            "35x21": { width: 70, height: 21, gap: 3, printable_height: 10 },
            "38x25": { width: 76, height: 25, gap: 2, printable_height: 20 }
        },
        default_size: "35x15",
        // TSPL coordinates (203 DPI = 8 dots per mm)
        left_label_x: 8,
        right_label_x: 305
    },

    /**
     * Show the barcode printing dialog
     * @param {Object} frm - Frappe form object
     */
    show_barcode_dialog: function(frm) {
        let item_codes = frm.doc.items.map(item => item.item_code);
        
        console.log("=== TRUSTBIT BARCODE DEBUG ===");
        console.log("Item codes:", item_codes);
        
        // Fetch actual barcodes from Item Barcode table
        frappe.call({
            method: "trustbit_barcode.api.get_item_barcodes",
            args: { item_codes: JSON.stringify(item_codes) },
            callback: function(r) {
                console.log("API Response:", r);
                let barcode_map = r.message || {};
                console.log("Barcode map:", barcode_map);
                
                // Build items array with actual barcodes
                let items = frm.doc.items.map(item => {
                    let bc = barcode_map[item.item_code] || item.item_code;
                    console.log(item.item_code + " => " + bc);
                    return {
                        item_code: item.item_code,
                        item_name: item.item_name,
                        qty: item.qty,
                        rate: item.rate,
                        barcode: bc
                    };
                });
                
                trustbit_barcode.create_dialog(frm, items);
            },
            error: function(err) {
                console.error("Error fetching barcodes:", err);
                // Fallback to item codes if API fails
                let items = frm.doc.items.map(item => ({
                    item_code: item.item_code,
                    item_name: item.item_name,
                    qty: item.qty,
                    rate: item.rate,
                    barcode: item.item_code
                }));
                trustbit_barcode.create_dialog(frm, items);
            }
        });
    },

    /**
     * Create and show the print dialog
     * @param {Object} frm - Frappe form object
     * @param {Array} items - Array of items with barcode info
     */
    create_dialog: function(frm, items) {
        // Build dialog fields dynamically
        let fields = [
            {
                fieldname: "label_size",
                fieldtype: "Select",
                label: "Label Size",
                options: "35x15\n35x21\n38x25",
                default: this.config.default_size
            },
            {
                fieldtype: "Section Break",
                label: "Select Items to Print"
            },
            {
                fieldname: "select_all_btn",
                fieldtype: "Button",
                label: "Select All"
            },
            {
                fieldtype: "Section Break"
            }
        ];
        
        // Add a row for each item
        items.forEach((item, idx) => {
            fields.push({
                fieldtype: "Check",
                fieldname: "check_" + idx,
                label: item.item_name.substring(0, 30),
                default: 1
            });
            fields.push({
                fieldtype: "Column Break"
            });
            fields.push({
                fieldtype: "Data",
                fieldname: "barcode_" + idx,
                label: "Barcode",
                default: item.barcode,
                read_only: 1
            });
            fields.push({
                fieldtype: "Column Break"
            });
            fields.push({
                fieldtype: "Currency",
                fieldname: "rate_" + idx,
                label: "Rate",
                default: item.rate,
                read_only: 1
            });
            fields.push({
                fieldtype: "Column Break"
            });
            fields.push({
                fieldtype: "Int",
                fieldname: "qty_" + idx,
                label: "Print Qty",
                default: item.qty || 1
            });
            fields.push({
                fieldtype: "Section Break"
            });
        });
        
        // Create the dialog
        let d = new frappe.ui.Dialog({
            title: __("Print Barcode Labels"),
            fields: fields,
            size: "large",
            primary_action_label: __("Print Barcodes"),
            primary_action: function(values) {
                // Collect selected items
                let selected = [];
                items.forEach((item, idx) => {
                    if (values["check_" + idx]) {
                        selected.push({
                            item_code: item.item_code,
                            item_name: item.item_name,
                            barcode: values["barcode_" + idx],
                            rate: values["rate_" + idx],
                            print_qty: values["qty_" + idx] || 1
                        });
                    }
                });
                
                if (!selected.length) {
                    frappe.msgprint(__("Please select at least one item"));
                    return;
                }
                
                d.hide();
                trustbit_barcode.print_via_qz(values.label_size, selected, frm.doc.name);
            }
        });
        
        // Handle Select All button
        d.$wrapper.find("[data-fieldname=select_all_btn]").on("click", function() {
            items.forEach((item, idx) => {
                d.set_value("check_" + idx, 1);
            });
        });
        
        d.show();
    },

    /**
     * Print labels via QZ Tray
     * @param {string} label_size - Label size (e.g., "35x15")
     * @param {Array} items - Array of items to print
     * @param {string} doc_name - Document name for logging
     */
    print_via_qz: function(label_size, items, doc_name) {
        // Check if QZ Tray is loaded
        if (typeof qz === "undefined") {
            frappe.msgprint({
                title: __("QZ Tray Not Found"),
                message: __("QZ Tray is not loaded. Please:<br><br>" +
                    "1. Make sure QZ Tray is installed and running<br>" +
                    "2. Refresh this page (Ctrl+Shift+R)<br>" +
                    "3. Try again<br><br>" +
                    "Download QZ Tray from: <a href='https://qz.io/download/' target='_blank'>qz.io/download</a>"),
                indicator: "red"
            });
            return;
        }
        
        frappe.show_alert({ message: __("Connecting to QZ Tray..."), indicator: "blue" });
        
        // Check if already connected, reuse connection to avoid "already connected" error
        let connectPromise;
        if (qz.websocket.isActive()) {
            console.log("QZ Tray: Reusing existing connection");
            connectPromise = Promise.resolve();
        } else {
            console.log("QZ Tray: Creating new connection");
            connectPromise = qz.websocket.connect();
        }
        
        connectPromise.then(function() {
            frappe.show_alert({ message: __("Printing..."), indicator: "blue" });
            
            // Generate TSPL commands
            let tspl = trustbit_barcode.generate_tspl(label_size, items);
            console.log("TSPL Commands:", tspl);
            
            // Create printer configuration
            let config = qz.configs.create(trustbit_barcode.config.printer_name);
            
            // Send print job
            return qz.print(config, [{ type: "raw", format: "command", data: tspl }]);
            
        }).then(function() {
            frappe.show_alert({ 
                message: __("Printed successfully: " + doc_name), 
                indicator: "green" 
            });
            
        }).catch(function(err) {
            console.error("QZ Tray Error:", err);
            frappe.msgprint({
                title: __("Print Error"),
                message: __("Error: " + err.message || err),
                indicator: "red"
            });
        });
    },

    /**
     * Generate TSPL commands for label printing
     * @param {string} label_size - Label size (e.g., "35x15")
     * @param {Array} items - Array of items to print
     * @returns {string} TSPL commands
     */
    generate_tspl: function(label_size, items) {
        let size_config = this.config.label_sizes[label_size] || this.config.label_sizes["35x15"];
        
        // TSPL header commands
        let cmds = [
            "SIZE " + size_config.width + " mm, " + size_config.height + " mm",
            "GAP " + size_config.gap + " mm, 0 mm",
            "SPEED 4",
            "DENSITY 8",
            "DIRECTION 1",
            ""
        ];
        
        // Expand items based on print quantity
        let labels = [];
        items.forEach(item => {
            let qty = parseInt(item.print_qty) || 1;
            for (let i = 0; i < qty; i++) {
                labels.push({
                    name: item.item_name || "",
                    barcode: item.barcode,
                    rate: item.rate || 0,
                    item_code: item.item_code || ""
                });
            }
        });
        
        // Generate labels in pairs (2-up printing)
        for (let i = 0; i < labels.length; i += 2) {
            cmds.push("CLS");
            
            // Left label (x = 8)
            let l1 = labels[i];
            let name1 = this.escape_text(l1.name.substring(0, 14));
            let rate1 = parseFloat(l1.rate).toFixed(0);
            
            cmds.push('TEXT ' + this.config.left_label_x + ',2,"1",0,1,1,"' + name1 + '"');
            cmds.push('BARCODE ' + this.config.left_label_x + ',16,"128",60,0,0,2,4,"' + l1.barcode + '"');
            cmds.push('TEXT ' + this.config.left_label_x + ',80,"1",0,1,1,"' + l1.barcode + '"');
            cmds.push('TEXT ' + this.config.left_label_x + ',96,"1",0,1,1,"' + l1.item_code + ' Rs' + rate1 + '"');
            
            // Right label (x = 305)
            if (i + 1 < labels.length) {
                let l2 = labels[i + 1];
                let name2 = this.escape_text(l2.name.substring(0, 14));
                let rate2 = parseFloat(l2.rate).toFixed(0);
                
                cmds.push('TEXT ' + this.config.right_label_x + ',2,"1",0,1,1,"' + name2 + '"');
                cmds.push('BARCODE ' + this.config.right_label_x + ',16,"128",60,0,0,2,4,"' + l2.barcode + '"');
                cmds.push('TEXT ' + this.config.right_label_x + ',80,"1",0,1,1,"' + l2.barcode + '"');
                cmds.push('TEXT ' + this.config.right_label_x + ',96,"1",0,1,1,"' + l2.item_code + ' Rs' + rate2 + '"');
            }
            
            cmds.push("PRINT 1");
            cmds.push("");
        }
        
        return cmds.join("\n");
    },

    /**
     * Escape special characters in text for TSPL
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escape_text: function(text) {
        if (!text) return "";
        return text.replace(/"/g, "'").replace(/\\/g, "");
    }
};

// Register event handler for Purchase Invoice
frappe.ui.form.on("Purchase Invoice", {
    refresh: function(frm) {
        // Only show button for submitted (docstatus=1) Purchase Invoices
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__("Print Barcode Labels"), function() {
                trustbit_barcode.show_barcode_dialog(frm);
            }, __("Create"));
        }
    }
});

// Also support Sales Invoice if needed
frappe.ui.form.on("Sales Invoice", {
    refresh: function(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__("Print Barcode Labels"), function() {
                trustbit_barcode.show_barcode_dialog(frm);
            }, __("Create"));
        }
    }
});

// Support Stock Entry as well
frappe.ui.form.on("Stock Entry", {
    refresh: function(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__("Print Barcode Labels"), function() {
                trustbit_barcode.show_barcode_dialog(frm);
            }, __("Create"));
        }
    }
});

console.log("Trustbit Advance Barcode Print v1.0.0 loaded");
