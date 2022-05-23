import moment from 'moment';

export function formatDate(date){
    return moment(date).format("DD-MM-YYYY");
}

export function formatTime(date){
    return moment(date).format("HH:mm");
}

export function formatDateTime(date, time){
    const newDate =  moment(date).format("YYYY-MM-DD") + " " + moment(time).format("HH:mm");
    return moment(newDate).format("YYYY-MM-DD HH:mm");
}

export function formatReadedDateTime(date){
    return moment(date).format("DD/MM/YYYY HH:mm");
}

export function formatUnix(date){
    return moment(date).unix();
}

export function formatDayName(date){
    return moment.utc(date.toLocaleString()).format('dddd');
}
