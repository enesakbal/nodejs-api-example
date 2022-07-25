const moment = require('moment')

exports.todayWithTime = async () => {
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    const today = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return today;
}

exports.today = () => {
    const today = moment().format('YYYY-MM-DD')
    return today;
}


exports.parseDatetime = async (value) => {

    console.log(moment(value).format('YYYY-MM-DD HH:mm:ss'))
    console.log(await this.todayWithTime());
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
}


exports.dateFromISO8601 = function (isostr) {
    var parts = isostr.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
}

exports.differenceDatesAndToday = async (value) => {
    const now = moment(await this.todayWithTime());
    const date = moment(await this.parseDatetime(value));

    let diffrence = moment.duration(now.diff(date)).asMinutes();
    console.log("difference : " + diffrence);
    return diffrence;

    // let now = moment().toISOString();
    // var diff = (this.dateFromISO8601(date) - this.dateFromISO8601(now))   
    // console.log(diff);
    // return diff.toString();
}

