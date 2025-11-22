document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const guardianCheckbox = document.getElementById('guardian');
    const guardianFields = document.getElementById('guardianFields');
    const messageDiv = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Initialize signature pad
    const canvas = document.querySelector("canvas");
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
    });

    // Handle canvas resizing
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.fromData(signaturePad.toData());
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Clear signature button
    const clearButton = document.querySelector("[data-action=clear]");
    clearButton.addEventListener("click", function(event) {
        event.preventDefault();
        signaturePad.clear();
    });

    // Toggle guardian fields
    guardianCheckbox.addEventListener('change', function() {
        guardianFields.style.display = this.checked ? 'block' : 'none';
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');

        // Clear previous messages
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';

        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            phone: document.getElementById('phone').value.trim() || null,
            cardId: document.getElementById('cardId').value.trim(),
            govId: document.getElementById('govId').value.trim() || null,
            yearOfBirth: parseInt(document.getElementById('yearOfBirth').value),
            addressStreet: document.getElementById('addressStreet').value.trim() || null,
            addressNumber: document.getElementById('addressNumber').value.trim() || null,
            addressCity: document.getElementById('addressCity').value.trim() || null,
            notes: document.getElementById('notes').value.trim() || null,
            guardian: guardianCheckbox.checked,
            guardianFirstName: guardianCheckbox.checked ? document.getElementById('guardianFirstName').value.trim() : null,
            guardianLastName: guardianCheckbox.checked ? document.getElementById('guardianLastName').value.trim() : null,
            guardianGovId: guardianCheckbox.checked ? document.getElementById('guardianGovId').value.trim() : null,
            notify: document.getElementById('notify').checked,
            signature: signaturePad.isEmpty() ? null : signaturePad.toDataURL(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Basic validation
        console.log('Form data:', formData);
        if (!formData.firstName || !formData.lastName || !formData.cardId || !formData.yearOfBirth) {
            console.log('Client-side validation failed');
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        console.log('Client-side validation passed, sending request');

        if (formData.yearOfBirth < 1900 || formData.yearOfBirth > new Date().getFullYear()) {
            showMessage('Please enter a valid year of birth', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.API_KEY}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('Response status:', response.status, 'Response ok:', response.ok, 'Result:', result);

            if (response.ok) {
                console.log('Showing success message');
                showMessage('Member registered successfully!', 'success');
                form.reset();
                signaturePad.clear();
                guardianFields.style.display = 'none';
            } else {
                console.log('Showing error message:', result.error);
                showMessage(result.error || 'Registration failed', 'error');
            }
        } catch (error) {
            showMessage('Network error. Please check your connection and try again.', 'error');
            console.error('Registration error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Member';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
});