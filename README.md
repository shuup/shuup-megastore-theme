Shuup Megastore Theme
=====================

This is Megastore Theme for Shuup.

Getting started
---------------

For Bash-based shells, this should do:

```bash
pip install -r requirements.txt
(cd shuup_megastore_theme && npm run build)
cd ..
python -m shuup_workbench migrate
python -m shuup_workbench createsuperuser
python -m shuup_workbench runserver 0.0.0.0:8000
```

For mock data, run

```bash
python -m shuup_workbench shuup_populate_mock
```
