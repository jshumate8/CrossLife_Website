// CrossLife Configuration
// Replace these with your actual Supabase and Web3Forms credentials

window.crosslifeConfig = {
    // Supabase Configuration
    // Get these from: https://app.supabase.com/project/_/settings/api
    supabase: {
        url: 'https://lymwrumdijyqraemdmjh.supabase.co',
        anonKey: 'sb_publishable_GEv_NVXYKsHfRoDXEQpyfQ_0Ezrnbug'
    },
    
    // Web3Forms Configuration
    // Get your access key from: https://web3forms.com/
    web3forms: {
        contactForm: 'b5d7a61a-fa2a-4dfc-8794-bfb8a1d61e65',
        donationUpdateForm: '9e8f1dde-f036-40c0-847a-31e17cce3f3c'
    }
};

// Initialize auth after config is loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (window.crosslifeAuth && window.crosslifeConfig.supabase.url !== 'YOUR_SUPABASE_URL_HERE') {
        await window.crosslifeAuth.init(
            window.crosslifeConfig.supabase.url,
            window.crosslifeConfig.supabase.anonKey
        );
    }
});
