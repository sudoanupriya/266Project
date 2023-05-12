const mongoose = require("mongoose");
const { Event } = require("../models/event_model");
var removePunctuation = require( '@stdlib/string-remove-punctuation' );

function removePunctuations(text) {
  /**Regex to replace all punctuations with space on search query` */
  return text.replace(/[{}[\]:,!\/=\-<>().;~|?'"](?![r])/g, ' ');
}


function dateResults(req, res, date) {
  console.log("test",date)
  Event.find({ date: date })
    .then((events) => {
      if (events.length == 0) {
        var parts = date.split("/");
        var year = parts[0];
        const regexPattern = new RegExp(year);
        console.log(year);
        Event.find({
          date: {
            $regex: regexPattern,
          },
        })
          .then((yearEvents) => {
            if (yearEvents.length == 0) {
              res.send("No matching results");
            } else {
              res.status(200).send({ results: yearEvents });
            }
          })
          .catch((err) => {
            console.log(err)
            res.status(400).send(err);
          });
      } else {
        res.status(200).send({ results: events });
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send(err);
    });
}

function descriptionAutoComplete(req, res, inputSearchWord,ad) {
  console.log("ad-->",ad);
  const wordArr = inputSearchWord.split(" ");
  let searchWord = "";

  /**Regex to match database entry with cleaned search query */
  const regexString = `^(?=.*\\b${wordArr.join("\\b)(?=.*\\b")}\\b).*$`;

  if (ad === "ad") {
    Event.find({
      description: { $regex: new RegExp(regexString, "gi") },
      date: { $not: /^-/ },
    }).limit(10)
      .then((wordResults) => {
        if (wordResults.length == 0) {
          res.status(200).send("No suggestion for this search");
        } else {
          res.status(200).send({ results: wordResults });
        }
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
  else if (ad === "bc") {
    Event.find({
      description: {
        $regex: new RegExp(regexString, "gi"),
      },
      date: { $regex: /^-/ },
    }).limit(10)
      .then((wordResults) => {
        if (wordResults.length == 0) {
          res.status(200).send("No suggestion for this search");
        } else {
          res.status(200).send({ results: wordResults });
        }
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}

const descriptionSearch = async (req, res, inputSearchWord, ad) => {
  const cleanText = removePunctuations(inputSearchWord);
  const wordArr = cleanText.split(" ");
  const regexString = `^(?=.*\\b${wordArr.join("\\b)(?=.*\\b")}\\b).*$`;
  if (ad === "true") {
    Event.find({
      description: { $regex: new RegExp(regexString, "gi") },
      date: { $not: /^-/ },
    })
      .then((wordResults) => {
        if (wordResults.length == 0) {
          res.status(200).send("No suggestion for this search");
        } else {
          res.status(200).send({ results: wordResults });
        }
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
  else if (ad === "false") {
    Event.find({
      description: {
        $regex: new RegExp(regexString, "gi"),
      },
      date: { $regex: /^-/ },
    })
      .then((wordResults) => {
        if (wordResults.length == 0) {
          res.status(200).send("No suggestion for this search");
        } else {
          res.status(200).send({ results: wordResults });
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(400).send(err);
      });
  }
}

exports.eventSearch = async (req, res) => {
  var date = req.query.date;
  dateLength = date.length;
  const ad = req.query.ad;
  const description = req.query.q;
  if (date.length != 0 && description.length === 0) {
    if (ad === "true") {
      dateResults(req, res, date);
    } else {
      const bcDate = "-"+req.query.date;
      dateResults(req, res, bcDate);
    }
  } else if (date.length === 0 && description.length != 0) {
    descriptionSearch(req,res,description, ad);
  } else {
    const wordArr = description.split(" ");
    const regexString = `^(?=.*\\b${wordArr.join('\\b)(?=.*\\b')}\\b).*$`;
    if (ad === "false") {
      date = '-'+date;
    }
    console.log(date)
    Event.find({
      date: date,
      description: { $regex: new RegExp(regexString, "gi") },
    })
      .then((compoundEvents) => {
        if (compoundEvents.length === 0) {
          console.log(date)
          var parts = date.split("/");
          var year = parts[0];
          console.log( typeof year, year)
          const regexPattern = new RegExp(year);
          Event.find({
            date: {
              $regex: regexPattern,
            },
            description : {
              $regex: new RegExp(regexString, "gi")
            }
          })
            .then((yearEvents) => {
              console.log(yearEvents)
              if (yearEvents.length == 0) {
                res.send("No matching results");
              } else {
                res.status(200).send({ results: yearEvents });
              }
            })
            .catch((err) => {
              console.log(err)
              res.status(400).send(err);
            });
          } else {
            res.status(200).send(compoundEvents);
          }
        })
        .catch((err) => {
          console.log(err)
          res.status(400).send(err);
        });
  }
};

exports.autoComplete = (req, res) => {
  const searchQuery = req.query.q;
  const ad = req.query.ad;
  descriptionAutoComplete(req, res, searchQuery, ad);
}