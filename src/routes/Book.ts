import express from 'express';
import controller from '../controllers/Book';

const router = express.Router();

router.post('/create', controller.createBook);
router.get('/get', controller.getAllBooks);

export = router;
