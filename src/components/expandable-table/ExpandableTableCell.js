import React from 'react';
import {
  TableHeadCell,
  TableDataCell,
  ExpandButton,
  PaddedContainer,
} from './ExpandableTableStyles';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import styled from 'styled-components';
import { makeStyles, TableSortLabel } from '@material-ui/core';

const CollapsedIcon = styled(ArrowRightIcon)`
  color: #e20074 !important;
`;

const ExpandedIcon = styled(ArrowDownIcon)`
  color: #e20074 !important;
`;

const useStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

const ExpandableTableCell = (props) => {
  const {
    colKey,
    value,
    cell,
    head,
    isExpandable,
    expanded,
    handleExpansion,
    order, 
    orderBy,
    onRequestSort,
    ...cellProps
  } = props;
  const classes = useStyles();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const renderCellContent = (children) => {
    return isExpandable ? (
      <ExpandButton onClick={handleExpansion}>
        {expanded ? <ExpandedIcon /> : <CollapsedIcon />}
        {children}
      </ExpandButton>
    ) : (
      <PaddedContainer pl={cell === 0 && 14}>
        {children}
      </PaddedContainer>
    );
  };

  return head ? orderBy === colKey ? (
    <TableHeadCell
      sortDirection={orderBy === colKey ? order : false}
      {...cellProps}
    >
      <TableSortLabel
        active={orderBy === colKey}
        direction={orderBy === colKey ? order : 'asc'}
        onClick={createSortHandler(colKey)}
      >
        {value}
        {orderBy === colKey ? (
          <span className={classes.visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </span>
        ) : null}
      </TableSortLabel>      
    </TableHeadCell>
  ) : (
    <TableHeadCell {...cellProps}>
      {value}      
    </TableHeadCell>
  ) : (
    <TableDataCell {...cellProps}>{renderCellContent(value)}</TableDataCell>
  );
};

export default ExpandableTableCell;
