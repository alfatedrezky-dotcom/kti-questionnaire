exports.validateQuestionnaire = (req, res, next) => {
    const { fullname, nis, email, knowAI, useAI, positiveImpact, negativeImpact, rating, agree } = req.body;

    if (!fullname || !nis || !email || !knowAI || !useAI || !positiveImpact || !negativeImpact || !rating || !agree) {
        return res.status(400).json({
            success: false,
            message: 'Field yang wajib diisi tidak lengkap'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Format email tidak valid'
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: 'Rating harus antara 1-5'
        });
    }

    next();
};
