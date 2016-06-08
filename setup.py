import setuptools


try:
    import shoop_setup_utils
except ImportError:
    shoop_setup_utils = None


if __name__ == '__main__':
    setuptools.setup(
        name="shuup_megastore_theme",
        version="1.0.0",
        description="Shuup Megastore Theme",
        packages=setuptools.find_packages(),
        include_package_data=True,
        entry_points={"shoop.addon": "shuup_megastore_theme=shuup_megastore_theme"},
        cmdclass=(shoop_setup_utils.COMMANDS if shoop_setup_utils else {}),
        install_requires=[
            'shoop>=3.0,<5',
        ],
    )
