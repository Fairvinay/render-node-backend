function formatDate(inputDate:any) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const dateParts = inputDate.split('-');
  if (dateParts.length !== 3) {
    return "Invalid Date";
  }

  const year = dateParts[0];
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "Invalid Date";
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return "Invalid Date";
  }

  const formattedDate = `${day} ${months[month - 1]}, ${year}`;
  return formattedDate;
}

function convertTo12HourFormat(time24hr:any) {
  const timeParts = time24hr.split(':');
  if (timeParts.length !== 3) {
    return "Invalid Time";
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  const seconds = timeParts[2];

  if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59 || isNaN(seconds) || seconds < 0 || seconds > 59) {
    return "Invalid Time";
  }

  const amPm = hours >= 12 ? 'PM' : 'AM';
  const twelveHourFormatHours = (hours % 12) || 12; // Handle midnight (0) as 12:00 AM

  const formattedTime = `${twelveHourFormatHours}:${minutes} ${amPm}`;
  return formattedTime;
}


export const convertDateToReadable = (date: string) => {
    const dt = date.split(" ")[0];
    const time = date.split(" ")[1];

    if (!time) {
        return formatDate(dt);
    } else {
        return `${formatDate(dt)} ${convertTo12HourFormat(time)}`;
    }
}