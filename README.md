# Trustbit Advance Barcode Print

A custom Frappe/ERPNext app for printing barcode labels directly to thermal printers using QZ Tray and TSPL commands.

![ERPNext](https://img.shields.io/badge/ERPNext-v14+-blue)
![Frappe](https://img.shields.io/badge/Frappe-v14+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- ✅ Print barcodes directly from **Purchase Invoice** (select items and quantities)
- ✅ Custom quantity input for each item
- ✅ Supports **35×15mm** and **35×21mm** label sizes
- ✅ **2-up printing** (two labels per row on 70mm roll)
- ✅ Labels include: **Item Name**, **Barcode Image**, **Barcode Number**, **Item Code**, and **Rate (₹)**
- ✅ Direct thermal printing via **TSPL** commands (fast & reliable)
- ✅ **QZ Tray** bundled - no separate server setup required
- ✅ Fetches actual barcodes from ERPNext's Item Barcode table

## Label Preview

```
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ Navbodh Little               │  │ Samsung Galaxy M52           │
│                              │  │                              │
│  |||||||||||||||||||||||     │  │  |||||||||||||||||||||||     │
│                              │  │                              │
│ KS00363                      │  │ KS00364                      │
│ ITM36026 Rs120               │  │ ITM36027 Rs24999             │
└──────────────────────────────┘  └──────────────────────────────┘
         Label 1 (x=8)                    Label 2 (x=305)
```

## Requirements

- ERPNext v14 or higher
- Frappe v14 or higher
- QZ Tray installed on client computer (where printer is connected)
- Thermal label printer (tested with TVS Electronics LP 46 Lite)

## Installation

### Step 1: Get the App

```bash
cd ~/frappe-bench
bench get-app https://github.com/YOUR_USERNAME/trustbit_barcode.git
```

### Step 2: Install on Site

```bash
bench --site your-site.local install-app trustbit_barcode
bench build --app trustbit_barcode
bench restart
```

### Step 3: Enable Raw Printing in ERPNext

1. Go to **Settings → Print Settings**
2. Enable **"Enable Raw Printing"**
3. Save

### Step 4: Install QZ Tray on Client Computer

QZ Tray must be installed on the computer where the printer is physically connected.

1. Download from: https://qz.io/download/
2. Install and run QZ Tray
3. QZ Tray will appear in your system tray/menu bar

## Usage

1. Open a **submitted Purchase Invoice**
2. Click **Create → Print Barcode Labels**
3. A dialog will appear with:
   - Label size selector (35×15mm or 35×21mm)
   - List of items with checkboxes
   - Barcode, Rate, and Print Quantity for each item
4. Select items and adjust quantities as needed
5. Click **Print Barcodes**
6. Labels will print directly to your thermal printer!

## Configuration

### Printer Name

By default, the app is configured for printer name `Bar Code Printer TT065-50`. 

To change this, edit the printer name in:
`trustbit_barcode/public/js/barcode_print.js`

Find this line and update:
```javascript
let config = qz.configs.create("Bar Code Printer TT065-50");
```

### Label Coordinates

The TSPL coordinates are optimized for 203 DPI printers. If you need to adjust:

| Parameter | Current Value | Description |
|-----------|---------------|-------------|
| Left Label X | 8 | X position for left label |
| Right Label X | 305 | X position for right label |
| Item Name Y | 2 | Y position for item name |
| Barcode Y | 16 | Y position for barcode |
| Barcode Number Y | 80 | Y position for barcode text |
| Item Code + Rate Y | 96 | Y position for bottom line |

### Supported Printers

Tested with:
- TVS Electronics LP 46 Lite (203 DPI)
- Other TSPL/TSPL2 compatible printers

The app uses **TSPL** (TSC Printer Language) which is supported by many thermal label printers including:
- TSC printers
- TVS Electronics printers
- Many Chinese thermal printers

## File Structure

```
trustbit_barcode/
├── trustbit_barcode/
│   ├── __init__.py
│   ├── hooks.py              # App configuration
│   ├── modules.txt           # Module list
│   ├── api.py                # Barcode fetching API
│   ├── public/
│   │   └── js/
│   │       ├── qz-tray.js    # QZ Tray library (bundled)
│   │       └── barcode_print.js  # Main client script
│   └── templates/
│       └── __init__.py
├── pyproject.toml
├── setup.py
├── README.md
├── LICENSE
└── .gitignore
```

## TSPL Command Reference

The app generates TSPL commands like this:

```tspl
SIZE 70 mm, 15 mm
GAP 3 mm, 0 mm
SPEED 4
DENSITY 8
DIRECTION 1

CLS
TEXT 8,2,"1",0,1,1,"Item Name"
BARCODE 8,16,"128",60,0,0,2,4,"KS00363"
TEXT 8,80,"1",0,1,1,"KS00363"
TEXT 8,96,"1",0,1,1,"ITM36026 Rs120"

TEXT 305,2,"1",0,1,1,"Item Name 2"
BARCODE 305,16,"128",60,0,0,2,4,"KS00364"
TEXT 305,80,"1",0,1,1,"KS00364"
TEXT 305,96,"1",0,1,1,"ITM36027 Rs24999"

PRINT 1
```

### TSPL Parameters

| Command | Description |
|---------|-------------|
| `SIZE 70 mm, 15 mm` | Label width × height |
| `GAP 3 mm, 0 mm` | Gap between labels |
| `SPEED 4` | Print speed (1-10) |
| `DENSITY 8` | Print darkness (1-15) |
| `TEXT x,y,"font",rotation,x-mult,y-mult,"text"` | Print text |
| `BARCODE x,y,"type",height,readable,rotation,narrow,wide,"data"` | Print barcode |

## Troubleshooting

### QZ Tray Not Connected

**Error:** `QZ Tray not loaded. Please refresh the page.`

**Solution:**
1. Ensure QZ Tray is installed and running (check system tray)
2. Refresh the browser page
3. When prompted, allow the browser to connect to QZ Tray

### Connection Already Exists Error

**Error:** `An open connection with QZ Tray already exists`

**Solution:** This has been fixed in the app. The code now reuses existing connections. If you still see this error, refresh the page once.

### Wrong Barcodes Printing

**Issue:** Item codes (ITM36026) printing instead of actual barcodes (KS00363)

**Solution:** The app fetches barcodes from the `Item Barcode` table. Make sure your items have barcodes configured:
1. Go to Item → Your Item
2. Scroll to "Barcodes" section
3. Add the barcode number

### Label Alignment Issues

**Issue:** Labels are misaligned or cut off

**Solution:**
1. Check your label roll dimensions match the configured size
2. Adjust coordinates in `barcode_print.js` if needed
3. Run printer calibration (GAPDETECT command)

## API Reference

### `trustbit_barcode.api.get_item_barcodes`

Fetches actual barcodes from the Item Barcode table.

**Parameters:**
- `item_codes` (list): List of item codes to fetch barcodes for

**Returns:**
- Dictionary mapping item codes to their barcodes

**Example:**
```python
import frappe
from trustbit_barcode.api import get_item_barcodes

barcodes = get_item_barcodes(["ITM36026", "ITM36027"])
# Returns: {"ITM36026": "KS00363", "ITM36027": "KS00364"}
```

## License

MIT License - Free for commercial use

## Support

For issues or feature requests, please create an issue on GitHub.

## Credits

Developed by **Trustbit**

- QZ Tray: https://qz.io/
- ERPNext: https://erpnext.com/
- Frappe Framework: https://frappeframework.com/
