const { Notification } = require("electron");
export function showNotification({ title, body }) {
  new Notification({
    title,
    body,
  }).show();
}
