import { HomeOutlined } from "@ant-design/icons";
import { Menu as AntdMenu } from "antd";

const Menu = () => {
  const items = [
    {
      label:
        "Team 6 - Historical Events Search",
      key: "team6",
      icon: <HomeOutlined />,
    },
  ];

  return <AntdMenu mode="horizontal" items={items} />;
};

export default Menu;
