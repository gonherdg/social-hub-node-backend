const mongoose = require("mongoose");
const PostMessage = require("../models/postMessage.js");

const zero = async (req, res) => {
    //const { id } = req.params;

    try {
        console.log("ZERO!");

        res.status(200).json({ message: "ZERO!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const one = async (req, res) => {
    try {
        const post = await PostMessage.findOne();

        console.log("ONE");

        res.status(200).json({ message: post });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const query = async (req, res) => {
    const query = req.query;

    try {
        //const post = await PostMessage.findOne();

        console.log("QUERY");

        res.status(200).json({ query: query });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { zero, one, query };
