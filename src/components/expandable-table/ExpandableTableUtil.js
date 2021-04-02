import moment from 'moment';

export function descendingComparator(a, b, orderBy, criteria) {
  if (criteria === 'datetime') {
    return new moment(a).isBefore(new moment(b)) ? -1 : 1;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  return 0;
}

export function getComparator(order, orderBy, criteria) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, criteria)
    : (a, b) => -descendingComparator(a, b, orderBy, criteria);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  const sortedArray = stabilizedThis.map((el) => el[0]);
  return sortedArray;
}