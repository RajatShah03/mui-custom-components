import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { TableWithSpacing } from './ExpandableTableStyles';
import ExpandableTableCell from './ExpandableTableCell';
import ExpandableTableRow from './ExpandableTableRow';
import { getComparator, stableSort } from './ExpandableTableUtil';

const createRows = (data, keys) => {
  let rowObj = {};
  keys.forEach(k => {
    rowObj[k] = data[k];
  });
  return rowObj;
};

const ExpandableTable = (props) => {
  const {
    head,
    expandedHead,
    data,
    expandable,
    sortBy,
    customCellComponent,
    errorComponent,
    customLayout,
    moreOptions,
  } = props;

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(sortBy);
  const [dataState, setDataState] = useState([...data]);

  const {columns, rows} = useMemo(() => {
    return {
      columns: head,
      rows: dataState.map((d) => createRows(d, Object.keys(head))),
    };
  }, [head, dataState]);

  useEffect(() => {
    setDataState([...data]);
  }, [data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    setDataState(stableSort(dataState, getComparator(newOrder, property)));
  };

  const renderRow = (row, rowIndex) => {
    const rowMap = Object.keys(row);
    return (
      <ExpandableTableRow
        key={row[rowMap[0]]}
        expandedData={dataState[rowIndex].expanded}
        extraData={dataState[rowIndex].extra}
        rowOptions={moreOptions || []}
        rowMap={rowMap}
        row={row}
        expandable={expandable}
        customCellComponent={customCellComponent}
        errorComponent={errorComponent}
        customLayout={customLayout}
        expandedHead={expandedHead}
      />
    );
  };

  return (
    <TableContainer>
      <TableWithSpacing>
        <TableHead>
          <TableRow>
            {Object.keys(columns).map((column) => (
              <ExpandableTableCell
                key={columns[column]}
                colKey={column}
                value={columns[column]}
                head={true}
                isExpandable={false}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                colSpan={customLayout[column].colSpan}
                align={customLayout[column].align}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(renderRow)}
        </TableBody>
      </TableWithSpacing>
    </TableContainer>
  );
};

ExpandableTable.propTypes = {
  head: PropTypes.shape({
    [PropTypes.string]: PropTypes.string
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  expandable: PropTypes.string.isRequired,
};

export default ExpandableTable;
