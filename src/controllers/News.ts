import {NextFunction, Request, Response} from 'express';
const circularJSON = require('circular-json');

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
    const {author, title, text, eventDates, publicationDate, filterTags, auditoryTags, interaction, techInfo} = req.body;
    const news = new News({
        _id: new mongoose.Types.ObjectId(),
        author,
        title,
        text,
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

/**
 * Сравнивает два объекта только по полям первого объекта
 * @param obj1 Object with some filds, which are in the `obj2`
 * @param obj2 A more complete object than the first one
 */
function NonNullFieldsObcjectCompare(obj1, obj2) {
     //Loop through properties in object 2
    for (var p in obj2) {
        //Check property exists on both objects
        if(obj1.hasOwnProperty(p) == obj2.hasOwnProperty(p)){
            switch (typeof (obj2[p])) {
                //Deep compare objects
                case 'object':
                    if (!NonNullFieldsObcjectCompare(obj1[p], obj2[p])) return false;
                    break;
                //Find substring in obj2 string
                case 'string':
                    if(!obj2[p].toString().includes(obj1[p].toString())) return false;
                    break;
                default:
                    if (obj1[p] != obj2[p]) {
                        return false;
                    }
            }
            }
            else {
            //May be we can decline this object
            //or ignore
        }
    }
    return true;
};
/** НАДО ЗАПОЛНИТЬ
 *
 * @param req
 *
 *
 */
const getNews = (req: Request, res: Response, next: NextFunction) => {
    const {author, title, text, eventDates, publicationDate, filterTags, auditoryTags, interaction,
        techInfo, page, countNews} = req.query;
    const tmpNew = req.query
    const pagination:number = (Number(page)-1)*Number(countNews);
    console.log(pagination);
    News.find({},function (error, docs:modelNews[]) {
        var arrayOfNews:Array<modelNews> = [];
        docs.forEach(function (value) {
            if(NonNullFieldsObcjectCompare(tmpNew,value.toJSON()))
                arrayOfNews.push(value);
        });
        if(arrayOfNews!==null) {
            if(pagination!=0)
            arrayOfNews = arrayOfNews.slice(pagination, pagination + Number(countNews));

            res.status(200).json({
                arrayOfNews,
                count: arrayOfNews.length,
            });
        }else{
            res.status(500).json({
                message: error.message,
                error,
            });
        }});
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
            message: "updated",
            id: docs[0]._id,
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
