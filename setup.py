"""
Timeline Application python package configuration.

"""

from setuptools import setup

setup(
    name='timelineApp',
    version='0.1.0',
    packages=['timelineApp'],
    include_package_data=True,
    install_requires=[
        'bs4==0.0.1',
        'Flask==1.1.1',
        'Flask-Testing==0.7.1',
        'nodeenv==1.3.5',
        'requests==2.21.0',
        'sh==1.12.14',
        'pillow=7.1.1',
        'pdf2image=1.12.1'
    ],
)