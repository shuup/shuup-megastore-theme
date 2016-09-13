import setuptools


try:
    import shuup_setup_utils
except ImportError:
    shuup_setup_utils = None


if __name__ == '__main__':
    setuptools.setup(
        name="shuup_megastore_theme",
        version="1.1.1",
        description="Shuup Megastore Theme",
        packages=setuptools.find_packages(),
        include_package_data=True,
        entry_points={"shuup.addon": "shuup_megastore_theme=shuup_megastore_theme"},
        cmdclass=(shuup_setup_utils.COMMANDS if shuup_setup_utils else {}),
        install_requires=[
            'shuup>=0.4',
        ],
    )
