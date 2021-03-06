const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const options = {toJSON: {virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename: String
});
// create virtual for all campgrounds and campground details
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_250,h_250,c_fill');
});

const CampgroundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    images: [ImageSchema],
    price: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required:  true
        }
    }
}, options);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h3><a href="/campgrounds/${this._id}">${this.title}</a></h3>
    <p>${this.description.substring(0,20)}</p>`
});
// add delete functions for images both in mongo and cloudinary
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);