import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Collapse, Paper } from '@material-ui/core';
import ExpandedTable from './ExpandedTable';
import {
  TableCellWithoutBorder,
  TableMoreCell,
  TableDataRow,
  MoreIconButton,
  MoreMenu,
  MoreMenuItem,
} from './ExpandableTableStyles';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandableTableCell from './ExpandableTableCell';

const TableRowMenu = ({ options, row }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (action) => {
    action(row);
    handleClose();
  };

  return (
    <div>
      <MoreIconButton onClick={handleClick} size="small">
        <MoreIcon />
      </MoreIconButton>
      <MoreMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {options.map(({label, action}) => (
          <MoreMenuItem
            key={label}
            onClick={() => handleOptionClick(action)}
          >
            {label}
          </MoreMenuItem>
        ))}
      </MoreMenu>
    </div>
  );
};

const ExpandableTableRow = (props) => {
  const MoreCellSpan = 1;

  const {
    expandedData,
    extraData,
    rowOptions,
    rowMap,
    row,
    expandable,
    customCellComponent,
    errorComponent,
    customLayout,
    expandedHead,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const totalColSpan = useMemo(() => {
    const span =  rowMap.reduce((s, rk) => (
      s + customLayout[rk].colSpan
    ), 0);
    return span + (rowOptions.length > 0 ? MoreCellSpan : 0);
  }, [customLayout, rowMap, rowOptions]);

  const toggleExpansion = () => setExpanded(e => !e);

  return (
    <>
      <TableDataRow component={Paper}>
        {rowMap.map((rowKey, index) => {
          const CustomComponent = customCellComponent[rowKey];
          const dataValue = rowKey === 'created_on' ? (
            moment.utc(row[rowKey]).local().format('MM/DD/YYYY hh:mm A') 
          ) : row[rowKey];
          const value = CustomComponent ? (
            <CustomComponent props={extraData.id}>{dataValue}</CustomComponent>
          ) : dataValue;
          return (
            <ExpandableTableCell
              key={value.toString()}
              colKey={rowKey}
              value={value}
              cell={index}
              isExpandable={expandable === rowKey}
              expanded={expanded}
              handleExpansion={toggleExpansion}
              colSpan={customLayout[rowKey].colSpan}
              align={customLayout[rowKey].align}
            />
          );
        })}
        {rowOptions.length > 0 && <TableMoreCell colSpan={MoreCellSpan}>
          <TableRowMenu options={rowOptions} row={extraData} />
        </TableMoreCell>}
      </TableDataRow>
      <TableDataRow component={Paper} relative>
        <TableCellWithoutBorder
          style={{
            paddingBottom: expanded ? '2rem' : 0,
            paddingTop: 0,
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
          colSpan={totalColSpan}
          top={-3}
        >
          <Collapse in={expanded}>
            <ExpandedTable
              head={expandedHead}
              data={expandedData}
              parent={extraData}
              customLayout={customLayout.expanded}
              customCellComponent={customCellComponent.expanded}
              ErrorComponent={errorComponent.expanded}
            />
          </Collapse>
        </TableCellWithoutBorder>
      </TableDataRow>
    </>
  );
};

export default ExpandableTableRow;
