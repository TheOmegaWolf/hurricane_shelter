import React from "react";
import HeaderStyle from "./Styles/Header.module.css";
import CommonStyle from "./Styles/Common.module.css";
const Header = () => {
  return (
    <>
      <div className={`${HeaderStyle.header} ${CommonStyle.dflex} ${CommonStyle.alignBoth}`}>Header</div>
    </>
  );
};

export default Header;
