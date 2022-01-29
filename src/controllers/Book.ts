import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/book';

const createBook = (req: Request, res: Response, next: NextFunction) => {
  const { author, title } = req.body;

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
  });

  return book
    .save()
    .then((result) => res.status(201).json({
      book: result,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const getAllBooks = (req: Request, res: Response, next: NextFunction) => {
  Book.find()
    .exec()
    .then((books) => res.status(200).json({
      books,
      count: books.length,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

export default { createBook, getAllBooks };
