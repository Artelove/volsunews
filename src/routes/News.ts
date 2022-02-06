import express from 'express';
import controller from '../controllers/News';

const router = express.Router();

/**
 * Send type of request to same page
 */
router.post('/create', controller.createNews);
router.get('/get', controller.getNews);
router.put('/put', controller.putNews);
router.delete('/delete', controller.deleteNews);

export = router;
