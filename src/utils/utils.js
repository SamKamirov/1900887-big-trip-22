import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { DateFormat, FilterType, SortingType } from '../const.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

const parseDate = (date, format) => dayjs(date).format(format);

const evaluateDuration = (dateFrom, dateTo) => {
  let tripDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const daysCount = Math.floor(tripDuration.asDays());
  if (daysCount > 30) {
    const format = DateFormat.DURATION.replace('DD[D] ', '');
    tripDuration = tripDuration.format(format);
    return `${daysCount}D ${tripDuration}`;
  }
  tripDuration = tripDuration.format(DateFormat.DURATION);
  return tripDuration.replace('00D 00H ', '').replace('00D ', '');
};

const compareDurations = (firstPoint, secondPoint) => {
  const firstPointDuration = dayjs.duration(dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom))).asMilliseconds();
  const secondPointDuration = dayjs.duration(dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom))).asMilliseconds();
  return secondPointDuration - firstPointDuration;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const filterPoints = (name, points) => {
  switch (name) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((item) => dayjs().isBefore(dayjs(item.dateFrom)));
    case FilterType.PRESENT:
      return points.filter((item) => dayjs().isBetween(dayjs(item.dateTo), dayjs(item.dateFrom)));
    case FilterType.PAST:
      return points.filter((item) => dayjs().isAfter(dayjs(item.dateTo)));
  }
};

const sortPoints = (name, points) => {
  switch (name) {
    case SortingType.DAY.name:
      points.sort((firstPoint, secondPoint) => dayjs(firstPoint.dateFrom) - dayjs(secondPoint.dateFrom));
      break;
    case SortingType.PRICE.name:
      points.sort((firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice);
      break;
    case SortingType.TIME.name:
      points.sort((firstPoint, secondPoint) => compareDurations(firstPoint, secondPoint));
      break;
  }
};

const getEarlierDate = (firstDate, secondDate) => (dayjs(dayjs(firstDate)).isAfter(dayjs(secondDate))) ? firstDate : secondDate;

const updateItem = (items, updatedItem) => items.map((item) => item.id === updatedItem.id ? updatedItem : item);


export {
  parseDate,
  evaluateDuration,
  isEscapeKey,
  filterPoints,
  updateItem,
  sortPoints,
  getEarlierDate
};
