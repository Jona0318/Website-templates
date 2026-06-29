# Cascara — lokaal ontwikkelen

Je kunt het thema volledig **lokaal** bouwen en previewen met de Shopify CLI.
Producten en foto's leven in de store (server-side), dus daarvoor heb je een
(gratis) store nodig — zie onderaan.

## Eenmalig instellen

1. **Shopify CLI installeren**
   ```bash
   npm install -g @shopify/cli@latest
   ```
2. **Gratis development store** (eenmalig, geen kosten): maak er een via
   https://partners.shopify.com → *Stores → Add store → Development store*.

## Lokaal draaien

```bash
cd shopify-themes/cascara

# Live preview met hot-reload op http://127.0.0.1:9292
npm run dev          # = shopify theme dev --store JOUW-STORE.myshopify.com

# Thema uploaden naar de store
npm run push         # = shopify theme push

# Wijzigingen uit de online-editor terughalen
npm run pull         # = shopify theme pull

# Thema controleren (linter)
npm run check        # = shopify theme check
```

> Tip: zet je store-adres één keer vast met de env-var, dan hoef je `--store`
> niet telkens te typen:
> ```bash
> export SHOPIFY_FLAG_STORE=JOUW-STORE.myshopify.com
> ```

Bij `npm run dev` opent een lokale URL. Wijzig je een `.liquid`/`.css`-bestand,
dan ververst de preview direct.

## Producten & foto's (kort)

- Die kun je **niet zuiver lokaal** opslaan; voeg ze toe in je store via
  **Beheer → Producten** (foto's onder *Media* bij elk product).
- Heb je nog geen producten? De secties tonen dan automatisch **placeholders**,
  dus het thema is toch volledig lokaal te bouwen.
- `shopify theme dev` toont de echte producten/foto's uit de gekoppelde store.

## Importeren zonder CLI

Geen CLI nodig? Gebruik de kant-en-klare zip in `downloads/cascara-shopify-theme.zip`
en upload die via **Onlinewinkel → Thema's → Thema toevoegen → Zip uploaden**.
