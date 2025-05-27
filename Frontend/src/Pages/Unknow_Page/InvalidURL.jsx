import React from 'react'
import OTA from "../../images/ota-logo_2.png"

function InvalidURL() {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: "column",
                    rowGap: '5vh'
                }}
            >
                <img src={OTA} alt="OTA" height={100} width={126} style={{ marginLeft: "-6vh" }} />
                <div style={{ display: 'flex' }}>
                    <b>404.</b>
                    <p style={{ color: 'gray' }}>&#160;That’s En Error.</p>
                </div>
                <div>
                    The Requested URL <b> {window.location.pathname} </b> Was Not Found On This Server.
                    <p style={{ color: 'gray', marginTop: '3px' }}>That’s All We Know.</p>
                </div>
            </div>
        </div>
    )
}

export default InvalidURL
