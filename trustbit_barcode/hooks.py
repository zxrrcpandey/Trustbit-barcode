app_name = "trustbit_barcode"
app_title = "Trustbit Advance Barcode Print"
app_publisher = "Trustbit"
app_description = "Direct thermal barcode label printing from ERPNext with QZ Tray"
app_email = "ra.pandey008@gmail.com"
app_license = "mit"
app_version = "1.0.0"

# Required Apps
required_apps = ["erpnext"]

# Includes in <head>
# ------------------

# Include JS files in all pages
app_include_js = [
    "/assets/trustbit_barcode/js/qz-tray.js",
    "/assets/trustbit_barcode/js/barcode_print.js"
]

# Include CSS files in all pages
# app_include_css = "/assets/trustbit_barcode/css/trustbit_barcode.css"

# Include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}

# Include js in page views
# page_js = {"page" : "public/js/page.js"}

# Include js in web views
# web_include_js = "/assets/trustbit_barcode/js/trustbit_barcode.js"

# Include CSS in web views
# web_include_css = "/assets/trustbit_barcode/css/trustbit_barcode.css"

# Home Pages
# ----------

# Application home page (will override Website Settings)
# home_page = "login"

# Website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# Automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "trustbit_barcode.install.before_install"
# after_install = "trustbit_barcode.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "trustbit_barcode.uninstall.before_uninstall"
# after_uninstall = "trustbit_barcode.uninstall.after_uninstall"

# Desk Notifications
# ------------------

# Notifications for documents that the user follows or created
# See frappe.core.notifications.get_notification_config

# notification_config = "trustbit_barcode.notifications.get_notification_config"

# Permissions
# -----------

# Permissions evaluated in scripted ways
# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }

# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------

# Override standard doctype classes
# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------

# Hook on document methods and events
# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"trustbit_barcode.tasks.all"
# 	],
# 	"daily": [
# 		"trustbit_barcode.tasks.daily"
# 	],
# 	"hourly": [
# 		"trustbit_barcode.tasks.hourly"
# 	],
# 	"weekly": [
# 		"trustbit_barcode.tasks.weekly"
# 	],
# 	"monthly": [
# 		"trustbit_barcode.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "trustbit_barcode.install.before_tests"

# Overriding Methods
# ------------------------------

# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "trustbit_barcode.event.get_events"
# }

# Each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "trustbit_barcode.task.get_dashboard_data"
# }

# Exempt linked doctypes from being automatically cancelled
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------

# before_request = ["trustbit_barcode.utils.before_request"]
# after_request = ["trustbit_barcode.utils.after_request"]

# Job Events
# ----------

# before_job = ["trustbit_barcode.utils.before_job"]
# after_job = ["trustbit_barcode.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"trustbit_barcode.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
