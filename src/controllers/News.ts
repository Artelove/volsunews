import {NextFunction, Request, Response} from 'express';

var bodyParser = require('body-parser')
import mongoose from 'mongoose';
import News from '../models/News';
import modelNews from '../@types/News/News';

/** Create the news Object with fields in json-file and save to DB
 * @param req contain in `req.body` fields for create new News as json-file :
 *
 *
 */

const createNews = (req: Request, res: Response, next: NextFunction) => {
    const {author, title, eventDates, publicationDate, filterTags, auditoryTags, interaction, techInfo} = req.body;
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
//return all News
const getNews = (req: Request, res: Response, next: NextFunction) => {
    const {author, title, eventDates, publicationDate, filterTags, auditoryTags, interaction, techInfo} = req.body;
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
/** Takes news by id and variables[] to correct these fields and save to DB
 * @param req contain in `req.body` 2 fields as json-file:
 *
 * @id - id field in the database for finding the record
 * @variables[] - Array of fields with values to be changed
 */
const putNews = (req: Request, res: Response, next: NextFunction) => {
    var {id, variables} = req.body;
    News.find({_id: id},function (err,docs) {
        console.log(docs);
        for(var v in variables) {
            docs[0][v] = variables[v];
        }
        docs[0].save().then((news) => res.status(200).json({
            docs,
        }))
            .catch((error) => res.status(500).json({
                message: error.message,
                error,
            }));;
    });
};
/** Take ids[] from json and delete records from DB
 * Algorithm: Take one news by id, delete one news, go to next id
 * @param req contain 1 field in json-file:
 * @ids - Array of id field in the database for finding the record
 */
const deleteNews = (req: Request, res: Response, next: NextFunction) => {
    const ids:String[] = req.body; // Array of ids
    ids.forEach(function (value) {
        console.log(value.toString());
        News.findOneAndDelete({_id: value.toString()}).exec().then((news) => res.status(200).json({
            message: "Deleted",
        }))
        .catch((error) => res.status(500).json({
            message: error.message,
            error,
        }));
    })
};

//Name of route functions
export default {createNews, getNews, putNews, deleteNews};
