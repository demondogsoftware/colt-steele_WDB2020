const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports = {
    async createReview (req, res) {
        const {id} = req.params;
        const campground = await Campground.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Review Added!');
        res.redirect(`/campgrounds/${campground._id}`);
    },
    async deleteReview (req, res) {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review Deleted!');
        res.redirect(`/campgrounds/${id}`);
    }
}