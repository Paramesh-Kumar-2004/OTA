import React from 'react';
import Header from "../../Components/Header/Header";
import "../../Styles/Settings.css";
import GetThemeColor from '../../Util/GetThemColor';




function Settings() {

  const { theme } = GetThemeColor()
  // const [colorSelection, setColorSelection] = useState('');
  // const [showColorSelection, setShowColorSelection] = useState(false)


  // function HandleColorSelection(e) {
  //   const color = e.target.value;

  //   // Check if the color is null, undefined, or "black" and set to black
  //   if (color === null || color === undefined || color === "black") {
  //     setColorSelection("black"); // Set state to black
  //     localStorage.setItem("theme", "black"); // Save black in localStorage
  //   } else {
  //     setColorSelection(color); // Set the selected color
  //     localStorage.setItem("theme", color.toLowerCase()); // Save the selected color in localStorage
  //   }
  // }

  // function HandleShowColorSelection() {
  //   if (!showColorSelection) {
  //     alert("Please Enter The Correct Spelling Of COLOR, A Valid HEX Value, RGB Value, or RGBA Value. Any Mistake Will Set It To Black.");
  //   }
  //   setShowColorSelection(!showColorSelection)
  //   setColorSelection("")
  // }


  return (
    <>
      <div style={{
        height: '100vh',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollbarWidth: "none",
      }}>

        <div
          style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            scrollbarWidth: "none",
            flex: 1,
          }}
        >
          <div style={{
            position: 'sticky',
            top: '0%',
            background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
            zIndex: 5
          }}>
            <Header title={"Settings"} />
          </div>

          {/* <div id="dashboardTrends" style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: "none",
          }}>


            <div className="setting">

              {!showColorSelection && (
                <div>
                  <input className='Closebtn' type="button" value="Select Color" onClick={HandleShowColorSelection} />
                </div>
              )}

              {showColorSelection && (
                <form onSubmit={HandleColorSelection}>

                  <label htmlFor="colorSelection">Enter Color :</label>
                  <input
                    className='InputField'
                    type="text"
                    value={colorSelection}
                    onChange={HandleColorSelection}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        alert("Click The Button : Apply All")
                      }
                    }}
                    placeholder='Enter Here To Verify'
                  />
                  <input className='Closebtn' type="button" value="Apply All" onClick={HandleShowColorSelection} />

                </form>
              )}

            </div>
            <div className="setting">2</div>
            <div className="setting">3</div>
            <div className="setting">4</div>
            <div className="setting">5</div>
            <div className="setting">6</div>



          </div> */}



        </div>

      </div>
    </>
  );
}

export default Settings;


