# Migration from Netlify to GitHub Pages + Supabase + Web3Forms

## Overview
This guide will help you complete the migration from Netlify services to free alternatives:
- **Hosting**: Netlify → GitHub Pages
- **Authentication**: Netlify Identity → Supabase Auth
- **Forms**: Netlify Forms → Web3Forms

## Step 1: Set up Supabase (Free)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project:
   - Choose a name (e.g., "CrossLife")
   - Create a strong database password
   - Select a region close to your users
3. Once created, go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public** key (long string starting with `eyJ...`)

5. Open `js/config.js` and replace:
   ```javascript
   supabase: {
       url: 'YOUR_SUPABASE_URL_HERE',
       anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
   }
   ```
   with your actual values.

6. In Supabase dashboard, go to **Authentication** → **URL Configuration**
   - Set **Site URL** to: `https://crosslife.org`
   - Add **Redirect URLs**:
     - `https://crosslife.org/*`
     - `https://crosslife.org/watch.html`
     - `https://crosslife.org/share.html`

## Step 2: Set up Web3Forms (Free)

1. Go to [https://web3forms.com](https://web3forms.com)
2. Click "Get Started" and enter your email: `donations@crosslife.org`
3. Check your email for the access key
4. Open `js/config.js` and replace:
   ```javascript
   web3forms: {
       accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY_HERE'
   }
   ```
   with your actual access key.

## Step 3: Update HTML Files

### For pages with authentication (index, watch, share, donate, course, lesson, etc.):

**Remove** this line from `<head>`:
```html
<script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

**Add** these lines instead (in `<head>`, before closing `</head>`):
```html
<script src="js/config.js"></script>
<script src="js/auth.js"></script>
```

**Replace** any `netlifyIdentity` calls with `crosslifeAuth`:
- `netlifyIdentity.open()` → `crosslifeAuth.open()`
- `netlifyIdentity.logout()` → `crosslifeAuth.logout()`
- `netlifyIdentity.on('init', ...)` → `crosslifeAuth.on('init', ...)`
- `netlifyIdentity.on('login', ...)` → `crosslifeAuth.on('login', ...)`
- `netlifyIdentity.on('logout', ...)` → `crosslifeAuth.on('logout', ...)`

### For forms (contact.html, update-donation.html):

**Remove** Netlify form attributes:
```html
<!-- OLD -->
<form data-netlify="true" data-netlify-recaptcha="true" name="contact">
```

**Replace** with Web3Forms setup:
```html
<!-- NEW -->
<form id="contactForm">
    <!-- Add honeypot field for spam protection -->
    <input type="checkbox" name="botcheck" style="display: none;">
```

**Add** these scripts before closing `</body>`:
```html
<script src="js/config.js"></script>
<script src="js/web3forms.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.web3FormsHandler) {
        window.web3FormsHandler.attachToForm('contactForm', {
            redirectUrl: '/thank-you.html',
            resetForm: true
        });
    }
});
</script>
```

## Step 4: Testing

1. Test authentication:
   - Try signing up with a new email
   - Check your email for confirmation link
   - Try logging in
   - Test logout

2. Test forms:
   - Submit the contact form
   - Check the email you configured in Web3Forms
   - Verify form submission was received

## Step 5: Clean Up

Once everything is working:

1. Remove `netlify.toml` file (no longer needed)
2. Go to Netlify dashboard and delete the site
3. Cancel any paid Netlify subscriptions

## Cost Comparison

| Service | Netlify | New Setup |
|---------|---------|-----------|
| Hosting | $15-45/month (depending on usage) | **Free** (GitHub Pages) |
| Authentication | Included in hosting cost | **Free** (Supabase: 50,000 users) |
| Forms | Included (100 submissions/month) | **Free** (Web3Forms: unlimited) |
| **Total** | **$15-45/month** | **$0/month** |

## Supabase Limits (Free Tier)
- 50,000 monthly active users
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth

## Web3Forms Limits (Free Tier)
- Unlimited form submissions
- Email notifications
- File uploads
- Spam protection included

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify config.js has correct credentials
3. Check Supabase dashboard for auth errors
4. Check Web3Forms dashboard for form submissions

## Files Modified

- ✅ `js/auth.js` - New Supabase auth handler
- ✅ `js/web3forms.js` - New form submission handler  
- ✅ `js/config.js` - Configuration file (needs your credentials)
- ✅ `css/styles.css` - Added auth modal and form message styles
- ⏳ All HTML files - Need to update script references

## Next Steps

1. Get Supabase credentials and update config.js
2. Get Web3Forms access key and update config.js
3. Update all HTML files to use new auth system
4. Test everything thoroughly
5. Commit and push changes
6. GitHub Pages will automatically deploy
