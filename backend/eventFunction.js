
function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  
    oauth2Client.refreshAccessToken((err, tokens) => {
      if (err) {
        console.error("Error refreshing access token:", err);
        return;
      }
  
      const newAccessToken = tokens.access_token;
  
      // Store the new access token in your storage
      localStorage.setItem("access_token", newAccessToken);
  
      // Call the API function after refreshing the token
      insertEvent();
    });
  }
export default async function insertEvent(event) {

    const accessToken = localStorage.getItem("access_token");
    oauth2Client.setCredentials({
      access_token: accessToken,
    });
  
    try {
      const res = await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        resource: event,
      });
      // console.log("Event inserted:", res.data.htmlLink);
      return res.data;
    } catch (err) {
      if (err.code === 401) {
        // Access token expired, refresh and retry
        refreshAccessToken();
      } else {
        // console.error("Error inserting event:", err);
      }
      return err;
    }
  }
  