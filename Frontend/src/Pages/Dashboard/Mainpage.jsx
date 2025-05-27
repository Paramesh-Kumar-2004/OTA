import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Outlet } from "react-router";
import { useGetVehicalListQuery } from "../../api/api";
import { useDispatch } from "react-redux";
import { allVehicals } from "../../features/Vehicals/VehicalsSlice";
import "../../index.css"
import { CSS_STYLE } from "../../Constants/Constant";
import GetThemeColor from "../../Util/GetThemColor";


dayjs.extend(relativeTime);

function Mainpage() {
  const { isLoading, data } = useGetVehicalListQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(allVehicals(data?.data));
  }, [isLoading, data, dispatch]);

  const { storedBackground, storedColor } = GetThemeColor();

  return (
    <>
      <div id="APP" style={{
        background: storedBackground,
        color: storedColor,
        position: 'fixed',
        width: '100%',

      }}>
        <Grid container>

          {/* <Grid item sm={1}>
          <Sidebar />
        </Grid>
        <Grid item sm={11} sx={{ padding: "0px 40px", marginBottom: "40px" }}>
          <Box p={3}>
            <Outlet />
          </Box>
        </Grid> */}

          <Grid className="one" item sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '6%'
          }}>
            <Sidebar />
          </Grid>

          <Grid className="one" item sx={{
            marginLeft: '10%',
            marginRight: '4%',
            padding: "0px 0px",
            height: '100%',
            width: '90%',
            // marginBottom: '80px'
          }}>
            <Box p={3}>
              <Outlet />
            </Box>
          </Grid>

        </Grid>
      </div>
    </>
  );
}

export default Mainpage;

