# -*- coding: utf-8 -*-
# This file is part of Shuup.
#
# Copyright (c) 2012-2019, Shoop Commerce Ltd. All rights reserved.
#
# This source code is licensed under the SHUUP® ENTERPRISE EDITION -
# END USER LICENSE AGREEMENT executed by Anders Innovations Inc. DBA as Shuup
# and the Licensee.
from collections import defaultdict

from django import forms
from django.conf import settings
from django.utils.encoding import force_text
from django.utils.translation import ugettext_lazy as _

from shuup.core import cache
from shuup.front.themes import BaseThemeFieldsMixin
from shuup.utils.djangoenv import has_installed
from shuup.xtheme import Theme


class ShuupMegastoreTheme(BaseThemeFieldsMixin, Theme):
    identifier = "shuup_megastore_theme"
    name = _("Shuup Megastore Theme")
    author = "Shuup Team"
    template_dir = "shuup_megastore_theme/"

    _theme_fields = [
        ("group_items_by_supplier", forms.BooleanField(
            required=False, initial=False,
            label=_("Group items by supplier"),
            help_text=_("Group items by the supplier in basket and order")
        ))
    ]

    @property
    def fields(self):
        fields = self._theme_fields + super(ShuupMegastoreTheme, self).get_base_fields()
        if has_installed("shuup_product_reviews"):
            fields.extend([
                ("show_product_review", forms.BooleanField(
                    required=False, initial=True,
                    label=_("Show product reviews rating in product card.")
                ))
            ])
        return fields

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

    def render_product_review_rating(self, product):
        if not has_installed("shuup_product_reviews"):
            return ""

        cache_key = "_product_review_rendered_rating_%d" % product.pk
        cached_rating = cache.get(cache_key)

        if cached_rating:
            return cached_rating

        from shuup_product_reviews.utils import render_product_review_ratings
        rendered = render_product_review_ratings(product)

        if rendered:
            cache.set(cache_key, rendered)
            return rendered

        return ""

    def group_lines_by_supplier(self, lines):
        groupped_lines = defaultdict(list)
        if lines:
            for line in lines:
                groupped_lines[line.supplier].append(line)
        return groupped_lines
