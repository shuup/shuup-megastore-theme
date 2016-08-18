from django.conf import settings
from django.utils.encoding import force_text
from django.utils.translation import ugettext_lazy as _

from shuup.apps import AppConfig
from shuup.xtheme import Theme

from shuup.front.themes import views

class ShuupMegastoreTheme(Theme):
    identifier = __name__
    name = _("Shuup Megastore Theme")
    author = "Yuki Miyagi"
    template_dir = "shuup_megastore_theme/"

    def get_view(self, view_name):
        print("get view")
        return getattr(views, view_name, None)

    def _format_cms_links(self, **query_kwargs):
        if "shuup.simple_cms" not in settings.INSTALLED_APPS:
            return
        from shuup.simple_cms.models import Page
        for page in Page.objects.visible().filter(**query_kwargs):
            yield {"url": "/%s" % page.url, "text": force_text(page)}

    def get_cms_navigation_links(self):
        return self._format_cms_links(visible_in_menu=True)


class ShuupMegastoreThemeAppConfig(AppConfig):
    name = __name__
    verbose_name = ShuupMegastoreTheme.name
    label = __name__
    provides = {
        "xtheme": __name__ + ":ShuupMegastoreTheme",
    }

default_app_config = __name__ + ".ShuupMegastoreThemeAppConfig"
