# -*- coding: utf-8 -*-
import shuup.apps


class AppConfig(shuup.apps.AppConfig):
    name = "shuup_megastore_theme"
    label = "shuup_megastore_theme"
    provides = {
        "xtheme": "shuup_megastore_theme.theme:ShuupMegastoreTheme",
    }
