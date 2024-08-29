/* eslint-disable no-extend-native */
String.prototype.formatToTimeOrDate = function (format) {
    const date = new Date(this);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    
    const options = format === 'time' 
        ? { hour: '2-digit', minute: '2-digit' }
        : { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleString('en-US', options);
};

String.prototype.trimWithEllipsis = function(maxLength) {
    if (this.length > maxLength) {
        return this.substring(0, maxLength) + '...';
    }
    return this;
};