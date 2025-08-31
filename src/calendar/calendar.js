const formatDateGoogle = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hour}${minute}${second}`;
};

function formatDateRangeForGoogleCalendar(schedule){
  const nextSchedule = getNextWeekday(schedule.day_index, new Date());
  const [hour, minute] = schedule.hour.split(':')
  nextSchedule.setHours(hour,minute,0,0)

  const dateStart = formatDateGoogle(nextSchedule)

  nextSchedule.setHours(nextSchedule.getHours()+1)
  const dateEnd = formatDateGoogle(nextSchedule)

  return `${dateStart}/${dateEnd}`
}

/**
 * Gets the next date for a specific weekday
 * @param {number} targetWeekday - 0 for Sunday, 1 for Monday, ..., 6 for Saturday
 * @param {Date} [fromDate=new Date()] - The reference date (defaults to today)
 * @returns {Date} The next occurrence of the target weekday
 */
function getNextWeekday(targetWeekday, fromDate = new Date()) {
  const currentDate = new Date(fromDate);
  const currentWeekday = currentDate.getDay();
  let daysToAdd = targetWeekday - currentWeekday;

  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + daysToAdd);

  return nextDate;
}

export default function googleCalendarLink(gc){
  const {schedules, address, name} = gc
  return [
    'https://calendar.google.com/calendar/render',
    '?action=TEMPLATE',
    `&text=${encodeURIComponent(`GC ${name}, Ooohh Gloria!!`)}`,
    `&dates=${formatDateRangeForGoogleCalendar(schedules[0])}`,
    '&details=Discuss%20project%20timeline',
    `&location=${encodeURIComponent(address.text)}`,
    '&recur=RRULE:FREQ=WEEKLY',
    '&sf=false',
    '&ctz=America/Sao_Paulo',
  ].join('')
}
