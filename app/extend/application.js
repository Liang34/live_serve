'use strict';

module.exports = {
  formatTime(time) {
    const d = new Date(time);
    const Month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
    const Day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
    const h = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
    const m = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
    const s = d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds();
    return d.getFullYear() + '-' + Month + '-' + Day + ' ' + h + ':' + m + ':' + s;
  },
};
