# Aurum — premium black & gold Shopify theme

A Shopify **Online Store 2.0** theme, ready to import as a `.zip`. Modern, premium
look in black with a gold accent (`#C89B3C`). Built to sell products: hero,
featured collection, product/collection/cart pages, blog, search and more.

## Import into Shopify

1. Download `downloads/aurum-shopify-theme.zip` from this repo.
2. In Shopify admin go to **Online Store → Themes**.
3. Click **Add theme → Upload zip file** and select the zip.
4. Click **Customize** to set your logo, menus and the hero image.
5. **Publish** when ready.

> The zip already has the correct structure (`config/`, `layout/`, `templates/`,
> `sections/`, `snippets/`, `assets/`, `locales/` at the root), so Shopify accepts
> it directly — no extra wrapping folder.

## Customize the colors / fonts

All colors and fonts are theme settings (**Customize → Theme settings**):

- Accent color default: `#C89B3C`
- Background default: `#0A0A0A`
- Heading font: Playfair Display · Body font: Assistant

## Structure

```
config/      settings_schema.json, settings_data.json
layout/      theme.liquid
templates/   index, product, collection, cart, page, blog, article,
             search, list-collections, 404, password (+ gift_card.liquid)
sections/    header/footer groups, hero, featured-collection, trust-bar,
             image-with-text, rich-text, newsletter, main-* sections
snippets/    product-card, price, placeholder
assets/      theme.css, theme.js
locales/     en.default.json
```

## Notes

- Product images come from your Shopify catalog; placeholders show until you add products.
- Set up your menus under **Navigation** (the header uses `main-menu`, the footer uses `footer`).
- The hero image is set in the theme editor (Hero section → Background image).
