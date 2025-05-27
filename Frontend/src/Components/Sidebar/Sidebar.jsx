import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import GetThemeColor from "../../Util/GetThemColor";

import "../../../src/style.css"
import styles from "../../Styles/SideBar.module.css"




function Sidebar({ role }) {

  const { theme } = GetThemeColor()
  // const [hoveredIcon, setHoveredIcon] = useState("");
  // const [activePage, setActivePage] = useState('');
  const [sidebar, setSideBar] = useState(false);
  const navigate = useNavigate()


  // Mouse Hover Handlers
  // function MouseIn(HoverIcon) {
  //   // console.log("MOUSE IN FUNCTION WORKING", HoverIcon);
  // }
  // function MouseOut() {
  //   // console.log("MOUSE OUT FUNCTION WORKING");
  // }

  function HandleNavClick(data) {
    // alert(data)
    navigate(data)
  }

  return (
    <>
      <div id={theme === "black" ? styles.MainDivDark : styles.MainDivLight}
        style={{
          // position:'fixed',
          height: '100vh',
          // width: sidebar ? "14vw" : "10vw",
          width: sidebar ? "12%" : "6%",
          transition: 'width 0.4s ease-in-out',
        }}
      >

        {/* <div id={styles.NavigateButtons}> */}
        <div id={sidebar ? styles.NavigateButtonsOpen : styles.NavigateButtonsClose}>

          {/* LOGO */}
          {sidebar ? (
            <div
              id={styles.expleoOpened}
              className={styles.ImagesOpened}
            ></div>
          ) : (
            <div
              id={styles.expleoClosed}
              className={styles.ImagesClosed}
            ></div>
          )}


          {/* DASHBOARD */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard")}>
              <div
                id={theme === "black" ? styles.DashbordImgDark : styles.DashbordImgLight}
                className={` ${styles.ImagesOpened}`} // Combine the two classNames
              ></div>
              <div className={styles.Text}>Dashboard</div>
            </div>
          ) : (
            <div
              id={theme === "black" ? styles.DashbordImgDark : styles.DashbordImgLight}
              className={` ${styles.ImagesClosed}`} // Combine the two classNames
              onClick={() => HandleNavClick("dashboard")}
            ></div>
          )}


          {/* USERS */}
          {role === "Admin" && (
            <div>
              {sidebar ? (
                <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard/users")}>
                  <div
                    id={theme === "black" ? styles.UserImgDark : styles.UserImgLight}
                    className={`${styles.ImagesOpened}`}
                  ></div>
                  <div>Users</div>
                </div>
              ) : (
                <div
                  id={theme === "black" ? styles.UserImgDark : styles.UserImgLight}
                  className={`${styles.ImagesClosed}`}
                  onClick={() => HandleNavClick("dashboard/users")}
                ></div>
              )}
            </div>
          )}



          {/* VEHICLES */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard/vehicles")}>
              <div
                id={theme === "black" ? styles.VehicleImgDark : styles.VehicleImgLight}
                className={`${styles.ImagesOpened}`}
              ></div>
              <div>Vehicles</div>
            </div>
          ) : (
            <div
              id={theme === "black" ? styles.VehicleImgDark : styles.VehicleImgLight}
              className={`${styles.ImagesClosed}`}
              onClick={() => HandleNavClick("dashboard/vehicles")}
            ></div>
          )}


          {/* SOFTWARES */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard/software")}>
              <div
                id={theme === "black" ? styles.SoftwareImgDark : styles.SoftwareImgLight}
                className={`${styles.ImagesOpened}`}
              ></div>
              <div>Softwares</div>
            </div>
          ) : (
            <div
              id={theme === "black" ? styles.SoftwareImgDark : styles.SoftwareImgLight}
              className={`${styles.ImagesClosed}`}
              onClick={() => HandleNavClick("dashboard/software")}
            ></div>
          )}


          {/* CAMPAIGNS */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard/campaign")}>
              <div
                style={{
                  minHeight: '3vh',
                  minWidth: '3vw',
                }}
                id={theme === "black" ? styles.CampaignImgDark : styles.CampaignImgLight}
                className={`${styles.ImagesOpened}`}
              ></div>
              <div>Campaigns</div>
            </div>
          ) : (
            <div
              style={{
                minHeight: '5vh',
                minWidth: '5vw',
                marginLeft: "2%"
              }}
              id={theme === "black" ? styles.CampaignImgDark : styles.CampaignImgLight}
              className={`${styles.ImagesClosed}`}
              onClick={() => HandleNavClick("dashboard/campaign")}
            ></div>
          )}

          {/* </div> */}


          {/* <div> */}

          {/* SETTINGS */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => HandleNavClick("dashboard/settings")}
              style={{
                marginTop: '5vh'
              }}
            >
              <div
                id={theme === "black" ? styles.SettingImgDark : styles.SettingImgLight}
                className={`${styles.ImagesOpened}`}
              ></div>
              <div>Settings</div>
            </div>
          ) : (
            <div
              style={{
                marginTop: '10vh'
              }}
              id={theme === "black" ? styles.SettingImgDark : styles.SettingImgLight}
              className={`${styles.ImagesClosed}`}
              onClick={() => HandleNavClick("dashboard/settings")}
            ></div>
          )}


          {/* CLOSE & OPEN */}
          {sidebar ? (
            <div className={styles.ImgAndText} onClick={() => setSideBar(!sidebar)}>
              <div
                id={theme === "black" ? styles.CloseImgDark : styles.CloseImgLight}
                className={`${styles.ImagesOpened} ${styles.Mini}`}
              ></div>
              <div className={styles.Mini}>Minimize</div>
            </div>
          ) : (
            <div className={styles.ImgAndText} onClick={() => setSideBar(!sidebar)}>
              <div
                id={theme === "black" ? styles.OpenImgDark : styles.OpenImgLight}
                className={`${styles.ImagesClosed}`}
                onClick={() => setSideBar(!sidebar)}
              ></div>
              {/* <div>Open</div> */}
            </div>
          )}
        </div>

      </div >
    </>
  );
}

export default Sidebar;


