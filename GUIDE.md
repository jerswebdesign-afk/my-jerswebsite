# Funnel Template Guide

A blank, ready-to-edit sales page for your course or digital product. You drop in your words, your images, your colors, and your checkout link, then deploy it for free. No coding required, you are just swapping text and a few values.

The page already has every section a good funnel needs, in order: hero, proof, pricing, product preview, a "why people stay stuck" section, a module list, a "why this is different" section, an FAQ, a final call to action, and a footer.

## 1. Run it on your computer

1. Install Node.js from nodejs.org (the LTS version is fine).
2. Open a terminal in this folder.
3. Run `npm install` once. This downloads what the site needs.
4. Run `npm run dev`. It prints a local web address (usually http://localhost:5173). Open it in your browser.

The page reloads automatically every time you save a file, so keep it open while you edit.

## 2. Where to change the words

All the page content lives in `src/components/`, one file per section. Open a file, find the placeholder text, and replace it with yours. You are only changing the words inside the quotes and tags, not the structure around them.

- `Hero.jsx` is the top of the page: the eyebrow label, the big headline, the one-line subhead, and the small tagline. The terminal label currently says "yourbrand", change it to your name.
- `Proof.jsx` is the proof wall. See the image section below for swapping in screenshots.
- `Pricing.jsx` is your two tiers: names, prices, the crossed-out anchor price, the feature lists, the guarantee box, and the button labels.
- `VaultPreview.jsx` is the framed product preview.
- `StayStuck.jsx` is the problem section plus the three-step "how it works".
- `Modules.jsx` is the module or lesson list and the counts.
- `Differentiator.jsx` is the "not this, but this" list.
- `Faq.jsx` is the questions and answers. Add or remove items in the list at the top of the file.
- `FinalCta.jsx` is the closing line and last button.
- `Footer.jsx` is the bottom bar: your brand name, your support email, and your social link.

## 3. Add your images

The template ships with no images. Every image spot is a placeholder box that says "Your image".

1. Put your image files in the `public` folder (for example `public/proof-1.png`).
2. In the component, replace the placeholder box (the div that says "Your image") with an image tag, for example:
   `<img src="/proof-1.png" alt="A short description" className="w-full h-auto block" />`
3. Reference files with a leading slash and no `public` in the path. `public/proof-1.png` becomes `/proof-1.png`.

The proof wall in `Proof.jsx` is a grid, so add one image per box. The product preview in `VaultPreview.jsx` has one larger spot.

## 4. Change the color

The whole site is themed from one value. Open `tailwind.config.js` and find the `accent` color near the top. Change that single hex value to your brand color and the buttons, glows, and the hero animation all follow it. A light color keeps the dark look clean. A bright brand color works too.

## 5. Connect your checkout

The buy buttons currently link to `#`. The simplest way to take payment with no code is a Stripe payment link.

1. In your Stripe dashboard, create a Payment Link for each tier.
2. In `Pricing.jsx`, find each button (look for the comment that says "Replace with your Stripe payment link") and change `href="#"` to your payment link URL.

That is enough to sell. Delivering the product after payment (sending buyers their files) is a separate step covered in the course operations lessons.

## 6. Put it online for free

1. Push this folder to a GitHub repository.
2. Go to vercel.com, sign in with GitHub, and import the repository.
3. When it asks for the framework preset, choose Vite. It fills in the rest (build command `npm run build`, output `dist`).
4. Click deploy. In about a minute you have a live link.

If this folder is inside a bigger repo, set the Root Directory in Vercel to this folder so it can find the project.

## 7. Use your own domain

In your Vercel project, open Settings then Domains and add your domain. Vercel shows you the DNS records to add at your domain provider. Add them, set your main domain as the primary so the temporary link redirects to it, and you are live on your own address.

That is the whole template. Edit the words, drop in your images, set your color and your checkout link, deploy. You can have a clean, professional funnel live in an afternoon.
