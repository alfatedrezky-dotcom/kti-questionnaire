const pdfGenerator = require('../utils/pdfGenerator');
const emailService = require('../config/email');

let questionnaires = [];

exports.submitQuestionnaire = async (req, res) => {
    try {
        const data = req.body;

        questionnaires.push({
            ...data,
            id: Date.now(),
            createdAt: new Date()
        });

        console.log('📝 Data diterima dari:', data.fullname);

        const pdfBuffer = await pdfGenerator.generatePDF(data);
        console.log('📄 PDF berhasil dibuat');

        await emailService.sendEmailWithPDF(data.email, pdfBuffer, data.fullname);
        console.log('✉️ Email berhasil dikirim');

        res.json({
            success: true,
            message: 'Kuesioner berhasil dikirim',
            pdfUrl: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim kuesioner',
            error: error.message
        });
    }
};

exports.getStatistics = (req, res) => {
    try {
        const stats = {
            totalResponses: questionnaires.length,
            averageRating: questionnaires.length > 0 
                ? (questionnaires.reduce((sum, q) => sum + parseInt(q.rating), 0) / questionnaires.length).toFixed(2)
                : 0,
            responses: questionnaires
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik',
            error: error.message
        });
    }
};
