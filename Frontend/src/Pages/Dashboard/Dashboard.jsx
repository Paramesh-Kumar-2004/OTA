import React from 'react';
import CampaignTrends from '../../Components/Trends/CampaignTrends';
import Header from '../../Components/Header/Header'
import CampaignStatusCount from "../../Components/Counts"
import "../../style.css"
import "../../dashboard_animation.css"
import GetThemeColor from "../../Util/GetThemColor.js"
import CampaignTypePieChart from '../../Components/Trends/CampaignTypePieChart.jsx';



function Dashboard() {

  const { theme } = GetThemeColor();
  // console.log("From DashBoard :", getTextColor("red"))

  return (
    <div style={{
      height: '100vh',
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // flexWrap: 'wrap',
      overflowY: 'scroll',
      overflowX: 'hidden',
      scrollbarWidth: "none",
      // marginTop: '2%',
      // background: 'pink'
    }}>

      <div
        style={{
          overflowY: 'scroll',
          overflowX: 'hidden',
          scrollbarWidth: "none",
          // background: 'red'
        }}
      >
        {/* Dashboard content */}
        <div style={{
          position: 'sticky',
          top: '0%',
          background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
          zIndex: 5,
        }}>
          <Header title={"Dashboard"} />
        </div>
        <CampaignStatusCount />


        <div id="dashboardTrends" style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: "none",
        }}>


          <div style={{ minWidth: '250px', width: '45%' }}>
            <CampaignTrends />
          </div>
          {/* <div style={{ minWidth: '400px', width: '45%' }}>
            <VehicleTrends />
          </div> */}

          <div style={{ minWidth: '250px', width: '45%' }}>
            <CampaignTypePieChart />
          </div>


        </div>
      </div>

    </div>
  );
}

export default Dashboard;


