import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Successfully Posted a api message.' });
});

export default router;
