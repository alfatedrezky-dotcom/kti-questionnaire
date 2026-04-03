document.getElementById('questionnaireForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(document.getElementById('questionnaireForm'));
    const data = {
        // Data Pribadi
        fullname: formData.get('fullname'),
        nis: formData.get('nis'),
        email: formData.get('email'),
        class: formData.get('class'),
        phone: formData.get('phone'),

        // AI Knowledge
        knowAI: formData.get('knowAI'),
        aiSource: formData.getAll('aiSource'),

        // AI Usage
        useAI: formData.get('useAI'),
        aiApps: formData.getAll('aiApps'),
        aiPurpose: formData.getAll('aiPurpose'),

        // Impact
        positiveImpact: formData.get('positiveImpact'),
        negativeImpact: formData.get('negativeImpact'),
        rating: formData.get('rating'),

        // Suggestions
        suggestions: formData.get('suggestions'),
        agree: formData.get('agree'),

        // Timestamp
        submittedAt: new Date().toLocaleString('id-ID')
    };

    // Validate required fields
    if (!validateForm(data)) {
        showErrorMessage('Mohon lengkapi semua field yang wajib diisi (*)');
        return;
    }

    // Show loading spinner
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'flex';

    try {
        // Send data to backend
        const response = await fetch('http://localhost:5000/api/questionnaire/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Gagal mengirim data');
        }

        const result = await response.json();

        // Hide spinner
        spinner.style.display = 'none';

        // Show success message
        showSuccessMessage('✓ Data berhasil dikirim ke email dan PDF telah diunduh!');

        // Download PDF
        if (result.pdfUrl) {
            downloadPDF(result.pdfUrl, data.fullname);
        }

        // Reset form
        setTimeout(() => {
            document.getElementById('questionnaireForm').reset();
        }, 2000);

    } catch (error) {
        spinner.style.display = 'none';
        console.error('Error:', error);
        showErrorMessage('❌ Terjadi kesalahan. Mohon coba lagi.');
    }
});

function validateForm(data) {
    return data.fullname &&
        data.nis &&
        data.email &&
        data.knowAI &&
        data.useAI &&
        data.positiveImpact &&
        data.negativeImpact &&
        data.rating &&
        data.agree;
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.width = '300px';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.width = '300px';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function downloadPDF(pdfUrl, fileName) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Kuesioner_KTI_${fileName}_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
