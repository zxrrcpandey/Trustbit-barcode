# Trustbit Barcode

Direct thermal barcode label printing from ERPNext with QZ Tray integration.

## Features

- Print barcode labels directly from Purchase Invoice, Sales Invoice, and Stock Entry
- Configurable label sizes for different thermal printers
- Fetches selling prices from Item Price table
- Supports 2-column label layouts
- Uses TSPL commands for thermal printers (TVS LP 46 Lite, TSC printers, etc.)
- Auto-configures default settings on installation

## Requirements

- ERPNext v14 or v15
- QZ Tray installed on client machines (https://qz.io/download/)
- Thermal printer with TSPL support

## Installation

### Standard Installation

```bash
bench get-app https://github.com/zxrrcpandey/trustbit_barcode.git
bench --site your-site-name install-app trustbit_barcode
bench --site your-site-name migrate
bench restart
```

### If Build Fails (Alternative Installation)

If you encounter esbuild errors during installation, use this method:

```bash
# Step 1: Get app without building assets
bench get-app https://github.com/zxrrcpandey/trustbit_barcode.git --skip-assets

# Step 2: Manually link assets
mkdir -p ~/frappe-bench/sites/assets/trustbit_barcode/js/
cp ~/frappe-bench/apps/trustbit_barcode/trustbit_barcode/public/js/* ~/frappe-bench/sites/assets/trustbit_barcode/js/

# Step 3: Add to apps.txt (IMPORTANT: use printf to avoid concatenation issues)
printf '\ntrustbit_barcode\n' >> ~/frappe-bench/sites/apps.txt

# Step 4: Remove any duplicate/corrupted entries
# Check the file first:
cat ~/frappe-bench/sites/apps.txt
# If you see corrupted entries like "hrmstrustbit_barcode", fix manually:
# nano ~/frappe-bench/sites/apps.txt

# Step 5: Install and migrate
bench --site your-site-name install-app trustbit_barcode
bench --site your-site-name migrate
bench restart
```

## Configuration

After installation, go to **Barcode Print Settings** to configure:

1. **Default Printer Name**: The exact printer name as shown in your system
2. **Default Price List**: Price list to fetch selling prices from
3. **Label Sizes**: Add your label configurations

A default label size (35x15mm 2-up) is created automatically during installation.

## Usage

1. Open a **submitted** Purchase Invoice, Sales Invoice, or Stock Entry
2. Click **Create → Print Barcode Labels**
3. Select items and quantities
4. Click **Print Barcodes**

## Printer Setup

1. Install QZ Tray from https://qz.io/download/
2. Add your thermal printer in system settings
3. Note the exact printer name (e.g., "Bar Code Printer TT065-50")
4. Update printer name in Barcode Print Settings

## Troubleshooting

### Button not showing
- Clear browser cache (Ctrl+Shift+R)
- Document must be submitted (docstatus = 1)
- Check browser console (F12) for errors

### QZ Tray errors
- Ensure QZ Tray is running (check system tray)
- Check printer name matches exactly
- Allow QZ Tray permissions in browser

### No label sizes in dropdown
- Go to Barcode Print Settings
- Add at least one label size configuration

### Build errors during installation
- Use the alternative installation method above
- The app uses simple JS files that don't require bundling

### "App not in apps.txt" error
- Check apps.txt for corrupted entries: `cat ~/frappe-bench/sites/apps.txt`
- Fix any entries that are concatenated (e.g., "hrmstrustbit_barcode" should be "hrms" and "trustbit_barcode" on separate lines)
- Always use `printf '\napp_name\n'` instead of `echo "app_name"` when adding to apps.txt

## Uninstallation

```bash
bench --site your-site-name uninstall-app trustbit_barcode --yes
bench remove-app trustbit_barcode
```

## License

MIT License - Copyright (c) 2025 Trustbit
