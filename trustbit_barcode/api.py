# -*- coding: utf-8 -*-
# Copyright (c) 2025, Trustbit and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json


@frappe.whitelist()
def get_item_barcodes(item_codes):
    """
    Fetch actual barcodes from Item Barcode table for given item codes.
    
    Args:
        item_codes: List of item codes or JSON string of item codes
        
    Returns:
        Dictionary mapping item codes to their barcodes
        Example: {"ITM36026": "KS00363", "ITM36027": "KS00364"}
    """
    # Parse JSON string if needed
    if isinstance(item_codes, str):
        try:
            item_codes = json.loads(item_codes)
        except json.JSONDecodeError:
            item_codes = [item_codes]
    
    if not item_codes:
        return {}
    
    # Query the Item Barcode child table
    barcodes = frappe.db.sql("""
        SELECT parent, barcode
        FROM `tabItem Barcode`
        WHERE parent IN %s
        ORDER BY idx ASC
    """, [item_codes], as_dict=True)
    
    # Build mapping (use first barcode if multiple exist for an item)
    barcode_map = {}
    for b in barcodes:
        if b.parent not in barcode_map:
            barcode_map[b.parent] = b.barcode
    
    return barcode_map


@frappe.whitelist()
def get_purchase_invoice_items(purchase_invoice):
    """
    Get items from a Purchase Invoice with their barcodes.
    
    Args:
        purchase_invoice: Name of the Purchase Invoice
        
    Returns:
        List of items with barcode information
    """
    if not purchase_invoice:
        return []
    
    # Get items from Purchase Invoice
    items = frappe.db.sql("""
        SELECT 
            pii.item_code,
            pii.item_name,
            pii.qty,
            pii.rate,
            pii.amount
        FROM `tabPurchase Invoice Item` pii
        WHERE pii.parent = %s
        ORDER BY pii.idx ASC
    """, purchase_invoice, as_dict=True)
    
    if not items:
        return []
    
    # Get barcodes for all items
    item_codes = [item.item_code for item in items]
    barcode_map = get_item_barcodes(item_codes)
    
    # Add barcodes to items
    for item in items:
        item['barcode'] = barcode_map.get(item.item_code, item.item_code)
    
    return items


@frappe.whitelist()
def get_printer_settings():
    """
    Get printer settings for barcode printing.
    
    Returns:
        Dictionary with printer configuration
    """
    return {
        "printer_name": "Bar Code Printer TT065-50",
        "label_sizes": [
            {"value": "35x15", "label": "35×15mm (2-up on 70mm roll)"},
            {"value": "35x21", "label": "35×21mm (2-up on 70mm roll)"},
            {"value": "38x25", "label": "38×25mm"}
        ],
        "default_size": "35x15",
        "dpi": 203
    }
