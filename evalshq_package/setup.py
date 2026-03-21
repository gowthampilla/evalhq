# evalshq_package/setup.py
from setuptools import setup, find_packages # type: ignore

setup(
    name="evalshq-core", # The name they will use to pip install
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests",
    ],
    description="The deterministic simulation engine for enterprise AI.",
    author="EvalsHQ",
)