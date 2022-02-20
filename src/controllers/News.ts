import {Request, Response} from 'express';
import mongoose from 'mongoose';
import News from '../models/News';
import modelNews from '../@types/News/News';

/** Create the news Object with fields in json-file and save to DB
 * @param req contain in `req.body` fields for create new News as json-file :
 * @param res contain response (code, body)
 */

const createNews = (req: Request, res: Response) => {
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

    news.save()
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
 * @param obj1 Object with some fields, which are in the `obj2`
 * @param obj2 A more complete object than the first one
 */
function NotNullFieldsObjectCompare(obj1, obj2) {
    //Loop through properties in object 2
    for (let p in obj2) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) == obj2.hasOwnProperty(p)) {
            switch (typeof (obj2[p])) {
              //Deep compare objects
                case 'object':
                    if (!NotNullFieldsObjectCompare(obj1[p], obj2[p])) return false;
                    break;
              //Find substring in obj2 string
                case 'string':
                    if (!obj2[p].toString().includes(obj1[p].toString())) return false;
                    break;
                default:
                    if (obj1[p] != obj2[p]) {
                        return false;
                    }
            }
        }

    }
    return true;
}

/**
 * Accepts Get-parameters from the url `req.query`
 * Returns an array of objects of type `modelNews` with the necessary pagination
 * @string author, title, text, publicationDate, eventDates
 * @string[] filterTags, auditoryTags
 * @object interaction, techInfo
 * @number page, countNews
 * @param req contain fields as JSON-struct
 * @param res contain response (code, body)
 */
const getNews = (req: Request, res: Response) => {
    const {page, countNews} = req.query;
    const tmpNew = req.query //tmpNews - not full :modelNew
    const pagination:number = (Number(page)-1)*Number(countNews);
    News.find({},function (error, news:modelNews[]) {
        // If req.query is empty -> return all news
        if (Object.values(req.query).length == 0) {
            res.status(200).json({
                news,
                count: news.length,
            });
        }
        let arrayOfNews:Array<modelNews> = [] ;
        news.forEach(function (value) {
            if(NotNullFieldsObjectCompare(tmpNew,value.toJSON()))
                arrayOfNews.push(value);
        });
        if(arrayOfNews.length!=0) {
            if(pagination !== 0)
            arrayOfNews = arrayOfNews.slice(pagination, pagination + Number(countNews));

            res.status(200).json({
                arrayOfNews,
                count: arrayOfNews.length,
            });
        }else{
            res.status(500).json({
                message: "The request for the specified filtering did not return results",
            });
        }});
};

/** Update `obj2` fields with `obj1` field values
 *
 * @param obj1 as JSON-struct object containing fields and their values to update
 * @param obj2 more complete JSON-struct than the first one
 * @return obj2 with changed fields values
 *
 * @description put without validation
 */
function NotNullFieldsObjectPut(obj1, obj2) {
    //Loop through properties in object 2
    for (let p in obj2) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) == obj2.hasOwnProperty(p)) {
            console.log(p);
            switch (typeof (obj2[p])) {
              //Deep compare objects
                case 'object':
                    obj2[p] = NotNullFieldsObjectPut(obj1[p], obj2[p]);
                    break;
              //Replace strings
                case 'string':
                    obj2[p] = obj1[p];
                    break;
                default:
                    obj2[p] = obj1[p];
            }
        }
    }
    return obj2;
}
/** Takes news by id and variables[] to correct these fields and save to DB
 * @param req contain in `req.body` 2 fields as json-file:
 * @param res contain response (code, body)
 * @id - id field in the database for finding the record
 * @variables[] - Array of fields with values to be changed in news by id
 */
const putNews = (req: Request, res: Response) => {
    let {id, variables} = req.body;
    News.find({_id: id},function (error, news:modelNews[]) {
        let changedDoc = NotNullFieldsObjectPut(variables,news[0].toJSON());
        for (let v in changedDoc) {
            news[0][v] = changedDoc[v];
        }
        news[0].save().then(() => res.status(200).json({
            news,
            message: "updated",
            id: news[0]._id,
        }))
            .catch((error) => res.status(500).json({
                message: error.message,
                error,
            }));
    });
};
/** Take ids[] from json and delete records from DB
 * Algorithm: Take one news by id, delete one news, go to next id
 * @param req contain 1 field with array of `id` as JSON-struct
 * @param res contain response (code, body)
 * @ids - Array of id field in the database for finding the record
 */
const deleteNews = (req: Request, res: Response) => {
    const ids:String[] = req.body; // Array of ids
    ids.forEach(function (value) {
        console.log(value.toString());
        News.findOneAndDelete({_id: value.toString()}).exec().then(() => res.status(200).json({
            message: "id: " + value + " deleted",
        }))
        .catch((error) => res.status(500).json({
            message: error.message,
            error,
        }));
    })
};

//Name of route functions
export default {createNews, getNews, putNews, deleteNews};
