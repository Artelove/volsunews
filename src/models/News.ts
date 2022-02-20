import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import INews from '../@types/News/News';

const NewsSchema: Schema = new Schema(
  {
    author: { type: String, required: true }, // Author of current news
    title: { type: String, required: true }, // Title in hedder of news
    text: { type: String, required: true }, // Inner text of news
    publicationDate: { type: Date, required: true, default: Date.now() }, // Date, when news is publicated
    eventDates: { type: Array(Date), required: false }, // Dates of Date, when event shoud go on
    filterTags: { type: Array(String), required: true, default: ['All'] }, // Tags for search and filter for different accounts, with down-up struct (The most down contain all of the top of them)
    auditoryTags: { type: Array(String), required: true, default: ['All'] }, // Tags for views for different accounts groups, with up-down struct (Current tag contain all of the down)
    techInfo: {
      createDate: { type: String, required: true },
      type: { type: String, required: true },
      status: ['draft', 'pendingVerification', 'pendingPublicate', 'publicated', 'deleted'],
    },
    interaction: {
      button: {
        type: { type: String, required: true }, // Depends about clickAction
        title: { type: String, required: true, default: 'Title is missing' },
        text: { type: String, required: true, default: 'Text is missing' }, // InnerText
        clicksNumber: { type: Number, required: true, default: 0 }, // Number of click on this button
        clickAction: ['checkIn', 'goTolink'],
        //! IMPORTANT! //whoClicked {type: VolsuAccount, required:true} // need for news creator of organizer for contact with responded account
      },
      survey: {
        title: { type: String, required: true, default: 'Title is missing' },
        variants: { type: Array(String), requred: true, default: ['Missing1', 'Missing2', 'Missing2'] },
      },
      feedback: {
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        comments: {
          text: { type: String, required: true },
          likes: { type: Number, required: true, default: 0 },
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

NewsSchema.post<INews>('save', function () {
  logging.info('Mongo', 'Checkout the news we just saved: ', this);
});

export default mongoose.model<INews>('News', NewsSchema);
