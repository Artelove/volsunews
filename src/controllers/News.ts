import { NextFunction, Request, Response } from 'express';
var bodyParser = require('body-parser')
import mongoose from 'mongoose';
import News from '../models/News';

const createNews = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { author, title, eventDates, publicationDate, filterTags, auditoryTags, interaction ,techInfo } = req.body
  const news = new News({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
    eventDates,
    publicationDate,
    filterTags,
    auditoryTags,
    interaction,
    techInfo
  });

  return news
    .save()
    .then((result) => res.status(201).json({
      news: result,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const getNews = (req: Request, res: Response, next: NextFunction) => {
  const { author, title, eventDates, publicationDate, filterTags, auditoryTags, interaction, techInfo } = req.body
  News.find()
    .exec()
    .then((news) => res.status(200).json({
      news,
      count: news.length,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

export default { createNews, getNews};
