
socket.on("event-bri", (header_id, datas) => {
  if (header_id == session_id.toString()) {
    notifyMe(datas.NotifTitle, datas.NotifBody);
  }
});

function notifyMe(
  title,
  body,
  icon = "https://www.uidesk.id/wp-content/uploads/2020/06/woke.png"
) {
  if (!window.Notification) {
    console.log("Browser does not support notifications.");
  } else {
    // check if permission is already granted
    if (Notification.permission === "granted") {
      // show notification here
      var notify = new Notification(title, {
        body: body,
        icon: icon,
      });
    } else {
      // request permission from user
      Notification.requestPermission()
        .then(function (p) {
          if (p === "granted") {
            // show notification here
            var notify = new Notification(title, {
              body: body,
              icon: icon,
            });
          } else {
            console.log("User blocked notifications.");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
}
