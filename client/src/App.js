import { Col, Row } from "antd";
import React from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";

function App() {
  return (
    <div className="container">
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Menu />
        </Col>
        <Col span={24}>
          <Home />
        </Col>
      </Row>
    </div>
  );
}

export default App;
