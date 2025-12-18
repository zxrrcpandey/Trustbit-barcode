from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="trustbit_barcode",
    version="1.0.0",
    author="Trustbit",
    author_email="ra.pandey008@gmail.com",
    description="Direct thermal barcode label printing from ERPNext with QZ Tray",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/trustbit/trustbit_barcode",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "frappe",
    ],
    python_requires=">=3.10",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Framework :: Frappe",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Printing",
    ],
)
