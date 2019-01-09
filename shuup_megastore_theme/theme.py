# -*- coding: utf-8 -*-
from django import forms
from django.conf import settings
from django.utils.encoding import force_text
from django.utils.translation import ugettext_lazy as _

from shuup.xtheme import Theme


class ShuupMegastoreTheme(Theme):
    identifier = "shuup_megastore_theme"
    name = _("Shuup Megastore Theme")
    author = "Shuup Team"
    template_dir = "shuup_megastore_theme/"

    fields = [
        ("hide_prices", forms.BooleanField(required=False, initial=False, label=_("Hide prices"))),
        ("catalog_mode", forms.BooleanField(required=False, initial=False, label=_("Set shop in catalog mode"))),
        (
            "show_supplier_info",
            forms.BooleanField(
                required=False, initial=False, label=_("Show supplier info"),
                help_text=_("Show supplier name in product-box, product-detail, basket- and order-lines"))
        )
    ]

    def get_view(self, view_name):
        import shuup_megastore_theme.views as views
        return getattr(views, view_name, None)

    def _format_cms_links(self, **query_kwargs):
        if "shuup.simple_cms" not in settings.INSTALLED_APPS:
            return
        from shuup.simple_cms.models import Page
        for page in Page.objects.visible().filter(**query_kwargs):
            yield {"url": "/%s" % page.url, "text": force_text(page)}

    def get_cms_navigation_links(self):
        return self._format_cms_links(visible_in_menu=True)
