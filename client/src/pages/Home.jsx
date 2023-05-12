import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Empty,
  List,
  Pagination,
  Row,
  Select,
  Skeleton,
} from "antd";
import { Typography } from "antd";

const { Text } = Typography;

const baseUrl = "http://localhost:8800";

const dateFormatter = (input) => {
  const yearStr = input;
  const yearNum = parseInt(yearStr, 10);
  const absYear = Math.abs(yearNum);
  const yearBC = absYear + " BC";

  console.log(yearBC); // prints "200 BC"
  return yearBC;
};

function convertTime(time) {
  if (time < 1000) {
    return time.toFixed(2) + " ms";
  } else if (time < 60000) {
    return (time / 1000).toFixed(2) + " seconds";
  } else {
    return (time / 60000).toFixed(2) + " minutes";
  }
}

function Home() {
  const [options, setOptions] = useState([]);
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [ad, setAd] = useState("ad");
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPageElements, setCurrentPageElements] = useState([]);
  const [elementsPerPage, setElementsPerPage] = useState(20); // change as per your need
  const [pagesCount, setPagesCount] = useState(1);
  // const [allElements, setAllElements] = useState([]);
  const [totalElementsCount, setTotalElementsCount] = useState(0);

  const [selectedOption, setSelectedOption] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [latency, setLatency] = React.useState(null);

  const onSelect = (data, option) => {
    setSelectedOption(option);
    console.log(option.label);
    setInputValue(option.label);
  };

  const onChange = (data, option) => {
    setInputValue(data);
    setSelectedOption(option?.label);
  };

  const handleDate = (date) => {
    console.log("outside", date);
    setDate(date);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setAd(value);
  };

  function setElementsForCurrentPage() {
    console.log(data)
    const currentPageElements = data.slice(offset, offset + elementsPerPage);
    setCurrentPageElements(currentPageElements);
  }

  function setPaginationStates() {
    setPagesCount(Math.ceil(totalElementsCount / elementsPerPage));
    setElementsForCurrentPage();
  }



  const handleSubmit = useCallback(() => {
    const obj = {
      date,
      value: inputValue,
      ad: ad === "ad" ? "true" : "false",
    };
    const searchQuery = `/search?q=${inputValue}&date=${date}&ad=${
      ad === "ad" ? "true" : "false"
    }`;
    console.log(obj);
    console.log(searchQuery);
    setIsLoading(true);
    const startTime = performance.now();

    axios
      .get(baseUrl + searchQuery)
      .then((res) => {
        setIsLoading(false);
        const endTime = performance.now();
        setLatency(endTime - startTime);
        console.log(res.data);
        setData(res.data.results);
        setTotalElementsCount(res.data.results.length);
        setElementsForCurrentPage()
      })
      .catch((err) => {
        setIsLoading(false);
        const endTime = performance.now();
        setLatency(endTime - startTime);
        console.log(err);
        setData([]);
      });
  });

    useEffect(() => {
    setPaginationStates();
  }, [totalElementsCount, elementsPerPage, handleSubmit]);

  function handlePageClick(pageNumber) {
    const currentPage = pageNumber - 1;
    const offset = currentPage * elementsPerPage;
    setOffset(offset);
    setElementsForCurrentPage();
  }

  //   const setPaginationStates = () => {
  //     const { totalElementsCount, elementsPerPage } = this.state;
  //     setPagesCount({
  //         Math.ceil(totalElementsCount / elementsPerPage)
  //     }, () => {
  //         this.setElementsForCurrentPage();
  //     });
  // }

  useEffect(() => {
    if (inputValue?.length > 0) {
      axios
        .get(baseUrl + `/searchRecommendation?q=${inputValue}&ad=${ad}`)
        .then((res) => {
          // setOptions(res.data.results);
          console.log(typeof res.data.results);
          console.log(res.data.results);
          const obj = res.data.results;
          const list = Object.keys(obj).map((key) => {
            return {
              category1: obj[key].category1,
              category2: obj[key].category2,
              date: obj[key].date,
              label: obj[key].description,
              granularity: obj[key].granularity,
              lang: obj[key].lang,
              value: obj[key]._id,
            };
          });
          console.log("List-->", list);
          setOptions(list);
        })
        .catch((err) => {
          setOptions([]);
        });
    }
  }, [inputValue]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <AutoComplete
            value={inputValue}
            options={options}
            autoFocus={true}
            style={{ width: "100%" }}
            filterOption={(inputValue, option) => option?.label}
            onSelect={onSelect}
            onChange={onChange}
            dropdownMatchSelectWidth
            placeholder="Enter Search Word"
            allowClear
          />
        </Col>
        <Col span={6}>
          {ad === "ad" && (
            <DatePicker
              onChange={(_, dateString) => handleDate(dateString)}
              style={{ width: "100%" }}
              format={"YYYY/MM/DD"}
            />
          )}

          {ad === "bc" && (
            <DatePicker
              onChange={(_, dateString) => handleDate(dateString)}
              style={{ width: "100%" }}
              picker="year"
            />
          )}
        </Col>
        <Col span={6}>
          <Select
            defaultValue="ad"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "ad", label: "AD" },
              { value: "bc", label: "BC" },
            ]}
          />
        </Col>
        <Col span={9} offset={9}>
          <Button
            type="primary"
            size={"middle"}
            onClick={handleSubmit}
            loading={isLoading ? true : false}
          >
            Search
          </Button>
        </Col>

        <Col span={6}>
          <Text mark>
            Search Returned{" "}
            {data !== undefined
              ? data.length > 0
                ? data.length > 1
                  ? `${data.length} results`
                  : `${data.length} result`
                : `${data.length} results`
              : "0 results"}{" "}
            {latency !== null && `in ${convertTime(latency)}`}
          </Text>
        </Col>
      </Row>

      {isLoading ? (
        <Skeleton active style={{ marginTop: "25px" }} />
      ) : currentPageElements?.length > 0 ? (
        <>
          <List
            itemLayout="horizontal"
            dataSource={currentPageElements}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={<a href="#">{item.description}</a>}
                  description={
                    <>
                      <span>{item.category1} - {item.category2}</span>
                      <br />
                      <span>
                        {item.date.indexOf("-") === 0
                          ? dateFormatter(item.date)
                          : item.date}
                      </span>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          {pagesCount >= 1 && (
            <Pagination
              defaultCurrent={1}
              onChange={handlePageClick}
              size="small"
              total={totalElementsCount}
              showTotal={(total, range) =>
                {
                  console.log(range);
                  console.log(elementsPerPage);
                  return `${range[0]}-${range[1]} of ${total} items`
                }
              }
              pageSize={elementsPerPage}
              showSizeChanger={false}
            />
          )}
        </>
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
