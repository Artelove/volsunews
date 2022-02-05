import mongoose, {Schema} from 'mongoose';
import logging from '../config/logging';
import INews from '../@types/News/News';

const NewsSchema: Schema = new Schema(
    {
        author: {type: String, required: true}, //Author of current news
        title: {type: String, required: true}, //Title in hedder of news
        publicationDate: {type: Date, required: true, default:Date.now()}, //Date, when news is publicated
        eventDates: {type: Array(Date), required: false}, //Dates of Date, when event shoud go on
        filterTags: {type: Array(String), required: true}, //Tags for search and filter for different accounts, with down-up struct (The most down contain all of the top of them)
        auditoryTags: {type: Array(String), required: true}, //Tags for views for different accounts groups, with up-down struct (Current tag contain all of the down)
        interaction: {
            button: {
                type: {type: String, required: true}, //Depends about clickAction
                title: {type: String, required: true},
                text: {type: String, required: true}, //InnerText
                clicksNumber: {type: Number, required: true}, //Number of click on this button
                clickAction: ["checkIn", "goTolink"]
                //!IMPORTANT! //whoClicked {type: VolsuAccount, required:true} // need for news creator of organizer for contact with responded account
            },
            survey: {
                title: {type: String, required: true},
                variants: {type: Array(String), requred: true}
            },
            feedback: {
                likes: {type: Number},
                views: {type: Number},
                comments: {
                    text: {type: String, required: true},
                    likes: {type: Number, required: true}
                }
            }
        },
        techInfo: {
            createDate: {type: String, required: true},
            type: {type: String, required: true},
            status: ["draft", "pendingVerification", "pendingPublicate", "publicated", "deleted"]
        }
    },
    {
        timestamps: true,
    },
);

NewsSchema.post<INews>('save', function () {
    logging.info('Mongo', 'Checkout the news we just saved: ', this);
});

export default mongoose.model<INews>('News', NewsSchema);
