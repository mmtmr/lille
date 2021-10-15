import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./SideBar.css";

export const SideBar = () => {
  return (
    <>    <Menu>

      <a className="menu-item" href="/timelog">
        Time Log
      </a>

      <a className="menu-item" href="/task">
        Task
      </a>

      <a className="menu-item" href="/chart">
        Chart
      </a>

    </Menu>
    </>
  );
};
