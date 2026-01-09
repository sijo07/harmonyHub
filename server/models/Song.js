const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        default: 0
    },
    audioUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
