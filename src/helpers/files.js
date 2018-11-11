module.exports = {
  bytesToSize(bytes, withExtension, type, pointNumbers) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';

    if(typeof pointNumbers === 'undefined') {
      pointNumbers = 0;
    }
    if(typeof type === 'undefined') {
      type = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    }

    return (bytes / Math.pow(1024, type)).toFixed(pointNumbers) + (withExtension ? (' ' + sizes[type]) : '');
  }
}
