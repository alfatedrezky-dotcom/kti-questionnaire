const PDFDocument = require('pdfkit');

exports.generatePDF = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 40,
                bufferPages: true
            });

            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(24)
                .font('Helvetica-Bold')
                .text('📋 Kuesioner KTI', { align: 'center' })
                .fontSize(14)
                .font('Helvetica')
                .text('Penggunaan Artificial Intelligence di Kelas XI-I', { align: 'center' })
                .text('SMAN 75 Jakarta', { align: 'center' })
                .moveDown(0.5);

            doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#667eea');
            doc.moveDown();

            // Data Pribadi
            addSection(doc, '📌 DATA PRIBADI');
            addDataRow(doc, 'Nama Lengkap', data.fullname);
            addDataRow(doc, 'NIS', data.nis);
            addDataRow(doc, 'Email', data.email);
            addDataRow(doc, 'Kelas', data.class);
            addDataRow(doc, 'Nomor Telepon', data.phone || '-');
            doc.moveDown();

            // AI Knowledge
            addSection(doc, '🤖 PENGETAHUAN TENTANG ARTIFICIAL INTELLIGENCE');
            addDataRow(doc, 'Pengenalan AI', data.knowAI);
            addDataRow(doc, 'Sumber Pengetahuan', 
                Array.isArray(data.aiSource) ? data.aiSource.join(', ') : data.aiSource);
            doc.moveDown();

            // AI Usage
            addSection(doc, '💻 PENGGUNAAN ARTIFICIAL INTELLIGENCE');
            addDataRow(doc, 'Pengalaman Menggunakan AI', data.useAI);
            addDataRow(doc, 'Aplikasi AI yang Digunakan', 
                Array.isArray(data.aiApps) ? data.aiApps.join(', ') : (data.aiApps || '-'));
            addDataRow(doc, 'Keperluan Penggunaan AI', 
                Array.isArray(data.aiPurpose) ? data.aiPurpose.join(', ') : (data.aiPurpose || '-'));
            doc.moveDown();

            // Impact
            addSection(doc, '⚖️ DAMPAK PENGGUNAAN AI');
            addLongDataRow(doc, 'Dampak Positif', data.positiveImpact);
            addLongDataRow(doc, 'Dampak Negatif', data.negativeImpact);
            addDataRow(doc, 'Tingkat Manfaat', `${data.rating} dari 5`);
            doc.moveDown();

            // Suggestions
            addSection(doc, '💡 SARAN DAN MASUKAN');
            addLongDataRow(doc, 'Saran dan Masukan', data.suggestions || '-');
            doc.moveDown();

            // Footer
            doc.fontSize(10)
                .font('Helvetica')
                .text(`Diisi pada: ${data.submittedAt}`, { align: 'center' })
                .text('Data ini adalah bukti pengisian kuesioner KTI', { align: 'center', color: '#999' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

function addSection(doc, title) {
    doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#667eea')
        .text(title)
        .fillColor('#000')
        .fontSize(10)
        .moveDown(0.3);
}

function addDataRow(doc, label, value) {
    doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(label + ':', { continued: true })
        .font('Helvetica')
        .text(' ' + (value || '-'));
}

function addLongDataRow(doc, label, value) {
    doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(label + ':', { continued: false })
        .moveDown(0.2);
    
    doc.fontSize(9)
        .font('Helvetica')
        .text(value || '-', { 
            width: 480,
            align: 'left',
            lineGap: 2
        })
        .moveDown(0.5);
}
