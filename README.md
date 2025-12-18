# Trustbit Advance Barcode Print v1.0.2

Direct thermal barcode label printing from ERPNext with QZ Tray and TSPL commands.

## Features

- ✅ Print barcodes from **Purchase Invoice**, **Sales Invoice**, **Stock Entry**
- ✅ Configurable **Label Sizes** via Barcode Print Settings
- ✅ Multiple **Printer Support** per label size
- ✅ Fetch **Selling Price** from Item Price table (Standard Selling)
- ✅ **2-up printing** on thermal rolls (70mm width)
- ✅ **QZ Tray** integration for raw TSPL printing
- ✅ Editable rates before printing

## Installation

```bash
bench get-app https://github.com/zxrrcpandey/Trustbit-barcode.git
bench --site YOUR_SITE install-app trustbit_barcode
bench --site YOUR_SITE migrate
bench build
sudo supervisorctl restart all
```

## Configuration

1. Search for **"Barcode Print Settings"** in the search bar
2. Set **Default Printer Name**: `Bar Code Printer TT065-50`
3. Set **Default Price List**: `Standard Selling`
4. Add **Label Sizes** in the table:
   - Label Name: `35x15mm 2-up`
   - Check "Default"
   - Width: `70`, Height: `15`, Gap: `3`
   - Labels Per Row: `2`
   - Left X: `8`, Right X: `305`
   - Speed: `4`, Density: `8`
5. Click **Save**

## Requirements

- ERPNext
- [QZ Tray](https://qz.io/download/) installed and running on client machine
- TSPL-compatible thermal printer (TVS LP 46 Lite, TSC, etc.)

## Usage

1. Ensure **QZ Tray** is running on your Mac/PC
2. Open a submitted **Purchase Invoice** (or Sales Invoice, Stock Entry)
3. Click **Create → Print Barcode Labels**
4. Select label size and items to print
5. Adjust quantities or rates if needed
6. Click **Print Barcodes**

## Changelog

### v1.0.2
- Added Barcode Print Settings DocType
- Configurable label sizes and printers
- Fetch selling price from Item Price table

### v1.0.1
- Fixed price fetching from Standard Selling price list

### v1.0.0
- Initial release with QZ Tray integration

## License

MIT License - Trustbit 2025
