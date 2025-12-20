# CrossLife Ministry Website

A modern, responsive website for CrossLife Ministry - a Christian ministry focused on teaching and Bible study materials.

## Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Bible Studies**: Comprehensive study guides organized by category
- **Teachings**: Video and audio sermon content
- **Resources**: Downloadable PDFs and study materials
- **Donation Integration**: Easy link to external donation platforms
- **Contact Form**: Simple way for visitors to get in touch

## Pages

- `index.html` - Homepage with ministry overview
- `about.html` - About the ministry, mission, and leadership
- `studies.html` - Bible study resources with filtering
- `teachings.html` - Video and audio teachings
- `resources.html` - Downloadable materials
- `donate.html` - Donation page with multiple giving options
- `contact.html` - Contact form and ministry information

## Setup

### Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build process required - pure HTML, CSS, and JavaScript

### Customization

#### Update Content
- Replace placeholder text in each HTML file with your actual content
- Add your donation platform links in `donate.html`
- Update contact information in `contact.html`
- Add your actual images to the `images/` folder (create this folder)

#### Styling
- Customize colors and fonts in `css/styles.css` by modifying CSS variables at the top
- Current color scheme uses professional blues and golds

#### Images
Create an `images/` folder and add:
- Logo/branding images
- Study thumbnails
- Teaching video thumbnails
- Leadership photos
- Any other visual content

## Deployment to GitHub Pages

### Option 1: From Existing Repository

1. Create a new repository on GitHub named `crosslife-website` (or your preferred name)
2. Initialize git in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/crosslife-website.git
   git branch -M main
   git push -u origin main
   ```
4. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

Your site will be available at: `https://YOUR_USERNAME.github.io/crosslife-website/`

### Option 2: Custom Domain Setup

After enabling GitHub Pages:

1. In your repository Settings > Pages, add your custom domain (e.g., `crosslife.org`)
2. Create a `CNAME` file in the root directory with your domain name
3. Update your domain's DNS settings with your registrar:
   - Add these A records pointing to GitHub:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a CNAME record: `YOUR_USERNAME.github.io`
4. Keep your existing MX records for Google Workspace email

DNS propagation can take 24-48 hours.

## Alternative: Deploy to Netlify

1. Create account at [Netlify](https://www.netlify.com/)
2. Click "Add new site" > "Deploy manually"
3. Drag and drop this entire folder
4. Your site is live immediately
5. Configure custom domain in Netlify settings

### Netlify Form Handling

To enable the contact form on Netlify:
1. Add `data-netlify="true"` to the `<form>` tag in `contact.html`
2. Netlify will automatically handle form submissions
3. View submissions in Netlify dashboard

## Form Integration Options

The contact form needs a backend to work. Options:

### 1. Formspree (Easiest)
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
- Sign up at [Formspree](https://formspree.io/)
- Free tier: 50 submissions/month

### 2. Netlify Forms
```html
<form data-netlify="true" name="contact">
```
- Automatically works when deployed on Netlify
- Free tier: 100 submissions/month

### 3. Web3Forms
```html
<form action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
    ...
</form>
```
- Sign up at [Web3Forms](https://web3forms.com/)
- Free tier: 250 submissions/month

## Donation Platform Integration

Update the donation links in `donate.html`:

### PayPal
```html
<a href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID">
```
Create button at: PayPal > Donate Button

### Stripe
Use Stripe Payment Links or integrate Stripe Checkout

### Ministry-Specific Platforms
- [Subsplash](https://www.subsplash.com/)
- [Pushpay](https://pushpay.com/)
- [Givelify](https://www.givelify.com/)

## Adding Multimedia Content

### YouTube Videos
Replace the placeholder in `teachings.html`:
```html
<iframe width="100%" height="500" 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
    frameborder="0" allowfullscreen>
</iframe>
```

### Vimeo Videos
```html
<iframe src="https://player.vimeo.com/video/YOUR_VIDEO_ID" 
    width="100%" height="500" frameborder="0" allowfullscreen>
</iframe>
```

### Audio Files
```html
<audio controls>
    <source src="audio/sermon.mp3" type="audio/mpeg">
</audio>
```

## File Structure

```
CrossLife_Website/
├── index.html
├── about.html
├── studies.html
├── teachings.html
├── resources.html
├── donate.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/ (create this)
│   ├── logo.png
│   ├── hero-bg.jpg
│   └── ...
├── resources/ (create this for downloadable files)
│   └── study-guides/
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This website template is provided for CrossLife Ministry. Customize as needed for your ministry's use.

## Support

For questions about customization or deployment, refer to:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Next Steps:**
1. Add your content and images
2. Test locally in a web browser
3. Set up donation platform
4. Deploy to GitHub Pages or Netlify
5. Configure custom domain
6. Test contact form
7. Add your 501(c)(3) information
