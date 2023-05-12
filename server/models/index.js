const Event = require("../models/event_model");

const updateDocuments = async () => {
    const cursor = Event.find({
      date: { $type: "date" },
      date: { $not: { $regex: /^\d{4}$/ } },
    }).cursor();
  
    let updatedCount = 0;
  
    for await (const doc of cursor) {
      console.log("Processing document:", doc);
      doc.date = doc.date.getFullYear().toString();
      await doc.save();
      updatedCount++;
    }
  
    console.log(`Update successful. Total documents updated: ${updatedCount}`);
  };
  