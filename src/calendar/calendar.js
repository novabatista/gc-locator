const formatDateGoogle = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hour}${minute}${second}`;
};

const formatDateIOS = (date) => {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

function getDateRanges(schedule){
  const range = {start: null, end: null}

  const nextSchedule = getNextWeekday(schedule.day_index, new Date());
  const [hour, minute] = schedule.hour.split(':')
  nextSchedule.setHours(hour,minute,0,0)

  range.start = new Date(nextSchedule)

  nextSchedule.setHours(nextSchedule.getHours()+1)
  range.end = new Date(nextSchedule)

  return range;
}

function formatDateRangeForGoogleCalendar(schedule){
  const {start, end} = getDateRanges(schedule)
  const dateStart = formatDateGoogle(start)
  const dateEnd = formatDateGoogle(end)

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

const GOOGLE_ENCODE = true
const IOS_ENCODE = false
const FREQUENCY = 'FREQ=WEEKLY'

const getText = (text, encode)=> encode ? encodeURIComponent(text) : text
const getTitle = (gcname, encode)=> getText(`GC ${gcname}, Ooohh Gloria!!`, encode)
const getDescription = (encode)=> getText('Venha ser igreja com a gente 😁', encode)
const getLocation = (location, encode)=> getText(location, encode)

export function googleCalendarLink(gc, schedule){
  const {address, name, schedules} = gc
  const curSchedule = schedule ?? schedules[0]

  return [
    'https://calendar.google.com/calendar/render',
    '?action=TEMPLATE',
    `&text=${getTitle(name, GOOGLE_ENCODE)}`,
    `&details=${getDescription(GOOGLE_ENCODE)}`,
    `&location=${getLocation(address.text, GOOGLE_ENCODE)}`,
    `&dates=${formatDateRangeForGoogleCalendar(curSchedule)}`,
    `&recur=RRULE:${FREQUENCY}`,
    '&sf=false',
    '&ctz=America/Sao_Paulo',
  ].join('')
}

export function iosCalendarLink(gc, schedule){
  const {address, name, schedules} = gc
  const curSchedule = schedule ?? schedules[0]

  const {start, end} = getDateRanges(curSchedule)
  const icsContent = [
    'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NovaBatistaGC//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
        `UID:${Date.now()}@novabatista.com.br`,
        `SUMMARY:${getTitle(name, IOS_ENCODE)}`,
        `DESCRIPTION:${getDescription(IOS_ENCODE)}`,
        `LOCATION:${getLocation(address.text, IOS_ENCODE)}`,
        `DTSTART:${formatDateIOS(start)}`,
        `DTEND:${formatDateIOS(end)}`,
        `RRULE:${FREQUENCY}`,
        'SEQUENCE:0',
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
      'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const encodedIcs = encodeURIComponent(icsContent);
  return `data:text/calendar;charset=utf8,${encodedIcs}`;

}
