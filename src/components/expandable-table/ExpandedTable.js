import React from 'react';
import moment from 'moment';
import { TableRow, Table, TableBody } from '@material-ui/core';
import {
  ExpandedHeader,
  ExpandedHeaderCell,
  ExpandedTableCell,
} from './ExpandableTableStyles';
import styled from 'styled-components';

const NoDeploymentError = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-family: Helvetica;
  font-weight: 500;
  color: #a0a2a7;
`;

const ExpandedTable = (props) => {
  const {
    head,
    data,
    customLayout,
    customCellComponent,
    ErrorComponent,
    parent,
  } = props;

  return data.error ? (
    <NoDeploymentError>
      <ErrorComponent root={parent} />
    </NoDeploymentError>
  ) : (
    <Table style={{tableLayout: 'fixed'}}>
      <ExpandedHeader>
        <TableRow>
          {Object.keys(head).map(headKey => (
            <ExpandedHeaderCell
              key={head[headKey]}
              colSpan={customLayout[headKey].colSpan}
              align={customLayout[headKey].align}
            >
              {head[headKey]}
            </ExpandedHeaderCell>
          ))}
        </TableRow>
      </ExpandedHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={row.name}>
            {Object.keys(row).map((rowKey) => {
              const CustomComponent = customCellComponent[rowKey];
              const datetime = moment.utc(CustomComponent ? null : row[rowKey]);
              const dataValue = datetime.isValid() ? (
                datetime.local().format('MM/DD/YYYY hh:mm A')
              ) : CustomComponent ? (
                <CustomComponent
                  root={parent}
                  current={row[rowKey]}
                  currentIndex={index}
                />
              ) : row[rowKey];
              return (
                <ExpandedTableCell
                  key={rowKey}
                  colSpan={customLayout[rowKey].colSpan}
                  align={customLayout[rowKey].align}
                >
                  {dataValue}
                </ExpandedTableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpandedTable;
