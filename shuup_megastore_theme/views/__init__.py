from shuup.utils import update_module_attributes

from shuup.front.themes.views import basket_partial, product_preview, product_price

__all__ = [
    "basket_partial",
    "product_preview",
    "product_price"
]

update_module_attributes(__all__, __name__)
