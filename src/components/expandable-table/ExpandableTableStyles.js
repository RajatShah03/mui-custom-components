import styled from 'styled-components';
import {
  Table,
  TableRow,
  TableCell,
  ButtonBase,
  IconButton,
  Menu,
  TableHead,
} from '@material-ui/core';

export const TableWithSpacing = styled(Table)`
  border-spacing: 0 3px !important;
  border-collapse: separate !important;
  table-layout: fixed;
`;

export const TableDataRow = styled(TableRow)`
  // box-shadow: 0 2px 5px 0 #d4dbe7 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  border-bottom: unset !important;
  ${({ relative }) => relative && 'position: relative'};
`;

export const TableCellWithoutBorder = styled(TableCell)`
  border: 0;
  border-bottom: 0 !important;
  ${({ top }) => `
  position: relative;
  top: ${top}px;
  `}
  padding: ${({ expanded }) => expanded && '0 3.3rem 3rem 2rem !important'};
`;

export const TableHeadCell = styled(TableCellWithoutBorder)`
  
`;

export const TableDataCell = styled(TableCellWithoutBorder)`
  
`;

export const TableMoreCell = styled(TableDataCell)`
  
`;

export const PaddedContainer = styled.div`
  ${({pt}) => pt ? `padding-top: ${pt}px` : ''};
  ${({pr}) => pr ? `padding-right: ${pr}px` : ''};
  ${({pb}) => pb ? `padding-bottom: ${pb}px` : ''};
  ${({pl}) => pl ? `padding-left: ${pl}px` : ''};
`;

export const MoreIconButton = styled(IconButton)`
  &:focus {
    outline: none;
  }
`;

export const MoreMenu = styled(Menu)`
  & .MuiMenu-paper {
    padding: 0 !important;
    border-radius: 4px !important;
  }
`;

export const MoreMenuItem = styled(ButtonBase)`
  min-width: 8rem;
  padding: 0.4rem 0.6rem !important;
  justify-content: flex-start !important;
  transition: all 0.4s ease;
  &:hover {
    background-color: #e20074;
    color: #ffffff;
  }
  &:focus {
    outline: none;
  }
`;

export const ExpandedHeader = styled(TableHead)`
  width: 100%;
  background-color: #ebf0f8;
`;

export const ExpandedHeaderCell = styled(TableCellWithoutBorder)`
  color: #e20074 !important;
  font-weight: 500;
  padding: 0.2rem 1rem !important;
`;

export const ExpandedTableCell = styled(TableCell)`
  border: 0;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
`;

export const ExpandButton = styled(ButtonBase)`
  padding: 0.4rem !important;
  min-width: 6rem;
  border-radius: 4px !important;
  &:focus {
    outline: none;
  }
`;