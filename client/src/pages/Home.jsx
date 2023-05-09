import React from "react";
import { useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  Col,
  DatePicker,
  Divider,
  Empty,
  Input,
  List,
  Row,
} from "antd";
import dayjs from "dayjs";

const rawData = [
  {
    title: "Ant Design Title 1",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team",
    date: "2021-01-01",
  },
  {
    title: "Ant Design Title 2",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team",
    date: "2021-01-02",
  },
  {
    title: "Ant Design Title 3",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team",
    date: "2024-01-03",
  },
  {
    title: "Ant Design Title 4",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team",
    date: "2023-07-05",
  },
];

const baseUrl = "http://localhost:3001"

function Home() {
  const parsedData = rawData.map((item, index) => {
    return {
      key: index,
      ...item,
    };
  });
  const [data, setData] = useState(parsedData);
  // const [message, setMessage] = useState('Initial');

  const handleSearch = (searchValue) => {
    let searchUrl = baseUrl+'/search?q=${searchQuery}'
    searchUrl = searchUrl.replace("${searchQuery}", searchValue)
    console.log(searchUrl)
    axios.get(searchUrl)
      .then(response => {
        // console.log("Recieved response")
        // console.log(response.data)
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDate = (date) => {
    console.log("outside", date)

    if (!date) {
      setData(parsedData);
      return;
    }

    const filteredData = parsedData.filter((item) =>
      dayjs(item.date).isSame(date, "day")
    );
    setData(filteredData);
    // const filteredData = parsedData.filter((item) => item.date.includes(date));
    // setData(filteredData);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={12}>
          <DatePicker onChange={(_, dateString) => handleDate(dateString)} />
        </Col>
      </Row>
      {data.length !== 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description={
                  <>
                    <span>{item.description}</span>
                    <br />
                    <span>{item.date}</span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <>
          <Divider />
          <Empty description="No Data" />
        </>
      )}
    </>
  );
}

export default Home;
