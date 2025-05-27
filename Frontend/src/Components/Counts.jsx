import { useGetCampaignListQuery } from "../api/api"; // API query to get campaign list
// import { useNavigate } from "react-router-dom";

import Total_Campaign_Img from "../images/Campaign_List_Icons/Campaigns.png"
import Complete_Campaign_Img from "../images/Campaign_List_Icons/Success.png"
import NotConnect_Campaign_Img from "../images/Campaign_List_Icons/Await.png"
import Cancelled_Campaign_Img from "../images/Campaign_List_Icons/Cancel.png"
import Failed_Campaign_Img from "../images/Campaign_List_Icons/Failed.png"

import '../../src/style.css'




function Count() {


  // Initialize useNavigate hook at the top level
  // const navigate = useNavigate();

  // Fetch data from the API
  const { data, isLoading, isError } = useGetCampaignListQuery();

  // Conditionally render loading or error states
  if (isLoading) {
    return <div style={style.CampaignCount}>Loading...</div>; // Show a loading message while fetching data
  }

  if (isError) {
    return <div style={style.CampaignCount}>Error Fetching Campaigns Count!</div>; // Show an error message if something went wrong
  }

  // Initialize counts for each status
  const counts = 0
  const statusCount = {
    client_not_connect: counts,
    complete: counts,
    Cancel: counts,
    totalcampaign: counts,
    failed: counts
  };

  // Process the campaign list to count campaigns based on their status
  if (data && data.data) {
    const campaignList = data.data;

    // Iterate through each campaign and increment the count based on its status
    campaignList.forEach((item) => {
      const status = item.status ? item.status.toLowerCase() : '';

      // Update the status count based on the status value
      if (status === 'client not connect') {
        statusCount.client_not_connect += 1;
        statusCount.totalcampaign += 1
      }
      else if (status === 'success' || status === "partial success") {
        statusCount.complete += 1;
        statusCount.totalcampaign += 1
      }
      else if (status === 'cancelled') {
        statusCount.Cancel += 1;
        statusCount.totalcampaign += 1
      }
      else if (status === 'failed') {
        statusCount.failed += 1;
        statusCount.totalcampaign += 1
      }
    });
  }

  // const goToNewPage = () => {
  //   navigate("/dashboard/campaign");
  // };




  function count_number(e) {

    const data = parseInt(e.target.innerText, 10); // Convert to a number

    if (data > 999) {
      e.target.style.width = 'auto'
      e.target.style.background = "#dcd0ff"
      e.target.style.color = "#9932cc"
      e.target.style.overflow = "visible"
      e.target.style.zIndex = 5
      e.target.style.border = "2px solid #d3d3d3"
      e.target.style.borderRadius = "14px"
      e.target.style.cursor = "pointer"
    }
  }

  function reset_style(e) {
    e.target.style.width = ""
    e.target.style.background = ""
    e.target.style.color = ""
    e.target.style.overflow = ""
    e.target.style.zIndex = ""
    e.target.style.border = ""
    e.target.style.borderRadius = ""
  }

  return (

    <div id="mainstatuscount">

      <div className="iconandcontent">
        <div className="img_count">
          <img src={Total_Campaign_Img} alt="CampaignImgErr" className="count_page_icons" />
          {/* <h1 className="count_number" >{statusCount.totalcampaign}</h1> */}
          <h1 className="count_number"
            onMouseEnter={count_number} onMouseLeave={reset_style}>{statusCount.totalcampaign}</h1>
        </div>
        <div>
          <h4 className="title">Campaigns</h4>
          <div className="content">Total Campaigns Created</div>
        </div>
      </div>

      <div className="iconandcontent">
        <div className="img_count">
          <img src={Complete_Campaign_Img} alt="CampaignImgErr" className="count_page_icons" />
          {/* <h1 className="count_number" >{statusCount.complete + 1000}</h1> */}
          <h1 className="count_number"
            onMouseEnter={count_number} onMouseLeave={reset_style} >{statusCount.complete}</h1>
        </div>
        <div>
          <h4 className="title">Success</h4>
          <div className="content">Total Installed Campaigns</div>
        </div>
      </div>


      <div className="iconandcontent">
        <div className="img_count">
          <img src={Cancelled_Campaign_Img} alt="CampaignImgErr" className="count_page_icons"
            style={{
              // rotate:'30deg'
            }}
          />
          {/* <h1 className="count_number" >{statusCount.Cancel}</h1> */}
          <h1 className="count_number"
            onMouseEnter={count_number} onMouseLeave={reset_style} >{statusCount.Cancel}</h1>
        </div>
        <div>
          <h4 className="title">Cancel</h4>
          <div className="content">Total Cancelled Campaigns</div>
        </div>
      </div>


      <div className="iconandcontent">
        <div className="img_count">
          <img src={NotConnect_Campaign_Img} alt="CampaignImgErr" className="count_page_icons" />
          {/* <h1 className="count_number" >{statusCount.client_not_connect}</h1> */}
          <h1 className="count_number"
            onMouseEnter={count_number} onMouseLeave={reset_style} >{statusCount.client_not_connect}</h1>
        </div>
        <div>
          <h4 className="title">Ongoing</h4>
          <div className="content">Client Connection Pending</div>
        </div>
      </div>

      <div className="iconandcontent">
        <div className="img_count">
          <img src={Failed_Campaign_Img} alt="CampaignImgErr" className="count_page_icons" />
          {/* <h1 className="count_number" >{statusCount.failed}</h1> */}
          <h1 className="count_number"
            onMouseEnter={count_number} onMouseLeave={reset_style} >{statusCount.failed}</h1>
        </div>
        <div>
          <h4 className="title">Failed</h4>
          <div className="content">Software Update Failed</div>
        </div>
      </div>

    </div >
  );
};



const style ={
  CampaignCount : {
    backgrounf:'red',
      
  }
}

export default Count;

