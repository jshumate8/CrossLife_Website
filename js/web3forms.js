// Web3Forms Integration for CrossLife
// Replace Netlify Forms with Web3Forms

class Web3FormsHandler {
    constructor(accessKey) {
        this.accessKey = accessKey;
        this.apiEndpoint = 'https://api.web3forms.com/submit';
    }

    async submitForm(formData) {
        // Add access key to form data
        formData.append('access_key', this.accessKey);
        
        // Add honeypot field if not present
        if (!formData.has('botcheck')) {
            formData.append('botcheck', '');
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                return { success: true, message: data.message };
            } else {
                throw new Error(data.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            return { success: false, message: error.message };
        }
    }

    // Helper to handle form submission with UI feedback
    attachToForm(formId, options = {}) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Form with id "${formId}" not found`);
            return;
        }

        const {
            successMessage = 'Thank you! Your message has been sent successfully.',
            errorMessage = 'There was an error submitting the form. Please try again.',
            redirectUrl = null,
            resetForm = true,
            beforeSubmit = null,
            afterSubmit = null
        } = options;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Call before submit callback if provided
            if (beforeSubmit && typeof beforeSubmit === 'function') {
                const shouldContinue = beforeSubmit(form);
                if (shouldContinue === false) return;
            }

            // Disable submit button
            const submitBtn = form.querySelector('[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            // Gather form data
            const formData = new FormData(form);

            // Submit the form
            const result = await this.submitForm(formData);

            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }

            // Handle result
            if (result.success) {
                // Show success message
                this.showMessage(form, successMessage, 'success');

                // Reset form if requested
                if (resetForm) {
                    form.reset();
                }

                // Redirect if URL provided
                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1500);
                }
            } else {
                // Show error message
                this.showMessage(form, result.message || errorMessage, 'error');
            }

            // Call after submit callback if provided
            if (afterSubmit && typeof afterSubmit === 'function') {
                afterSubmit(result, form);
            }
        });
    }

    showMessage(form, message, type = 'success') {
        // Try to find existing message container
        let messageContainer = form.querySelector('.form-message');
        
        if (!messageContainer) {
            // Create message container if it doesn't exist
            messageContainer = document.createElement('div');
            messageContainer.className = 'form-message';
            form.appendChild(messageContainer);
        }

        messageContainer.textContent = message;
        messageContainer.className = `form-message form-message-${type}`;
        messageContainer.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}

// Initialize when config is available
if (window.crosslifeConfig && window.crosslifeConfig.web3forms.accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
    window.web3FormsHandler = new Web3FormsHandler(window.crosslifeConfig.web3forms.accessKey);
}
