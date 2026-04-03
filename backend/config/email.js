const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendEmailWithPDF = async (recipientEmail, pdfBuffer, recipientName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            cc: process.env.ADMIN_EMAIL,
            subject: '✓ Kuesioner KTI - Penggunaan AI di SMAN 75 Jakarta',
            html: `
                <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                        <h1 style="margin: 0; font-size: 28px;">📋 Terima Kasih</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px;">Kuesioner Anda Telah Diterima</p>
                    </div>

                    <div style="padding: 20px; background: #f8fafc; border-radius: 10px; margin-bottom: 20px;">
                        <p style="margin: 0 0 15px 0; font-size: 16px;">Halo <strong>${recipientName}</strong>,</p>
                        <p style="margin: 0 0 15px 0; color: #64748b; line-height: 1.6;">
                            Terima kasih telah mengisi kuesioner KTI tentang "Penggunaan Artificial Intelligence di Kelas XI-I SMAN 75 Jakarta". 
                            Data Anda telah kami terima dan akan digunakan untuk penelitian ini.
                        </p>
                        <p style="margin: 0 0 15px 0; color: #64748b; line-height: 1.6;">
                            Lampiran email ini berisi file PDF dari jawaban Anda sebagai bukti pengisian kuesioner.
                        </p>
                    </div>

                    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 13px;">
                        <p style="margin: 0 0 5px 0;">Hormat kami,</p>
                        <p style="margin: 0; font-weight: 600;">Tim KTI SMAN 75 Jakarta</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: `Kuesioner_KTI_${new Date().getTime()}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log('✓ Email berhasil dikirim ke:', recipientEmail);
        return true;

    } catch (error) {
        console.error('❌ Error mengirim email:', error.message);
        throw error;
    }
};
