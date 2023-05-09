
// server.js

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const rawData = [
    {
      title: "Backend Title 1",
      description:
        "Ant Design, a design language for background applications, is refined by Ant UED Team",
      date: "2021-01-01",
    },
    {
      title: "Backend Title 2",
      description:
        "Ant Design, a design language for background applications, is refined by Ant UED Team",
      date: "2021-01-02",
    },
    {
      title: "Backend Title 3",
      description:
        "Ant Design, a design language for background applications, is refined by Ant UED Team",
      date: "2024-01-03",
    },
    {
      title: "Backend Title 4",
      description:
        "Ant Design, a design language for background applications, is refined by Ant UED Team",
      date: "2023-07-05",
    },
  ];

app.get('/hello', (req, res) => {
    console.log(req)
    res.send(rawData);
});

app.get('/search', (req, res) => {
    console.log(req.query)
    searchValue = req.query.q
    const filteredData = rawData.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    res.send(filteredData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
