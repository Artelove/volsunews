import express from 'express';
import controller from '../controllers/News';

const router = express.Router();

router.post('/create', controller.createNews);
router.get('/get', controller.getNews);

export = router;
