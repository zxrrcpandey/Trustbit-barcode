from setuptools import setup, find_packages

setup(
    name="trustbit_barcode",
    version="1.0.2",
    author="Trustbit",
    author_email="ra.pandey008@gmail.com",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=["frappe"],
)
