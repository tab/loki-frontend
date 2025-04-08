import * as React from "react"
import { styled } from "@mui/material/styles"
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { tableCellClasses } from "@mui/material/TableCell"

interface Column {
  label: string
  accessor: keyof any
  align: "left" | "right" | "center"
}

interface CustomTableProps {
  columns: Column[]
  rows: any[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.secondary.main,
    // color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

const CustomTable: React.FC<CustomTableProps> = ({ columns, rows }) => {
  return (
    <TableContainer component={Paper} elevation={1}>
      <MuiTable aria-label="custom table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column.label} align={column.align || "left"}>
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <StyledTableRow key={index} hover>
              {columns.map((column) => (
                <StyledTableCell key={column.label} align={column.align || "left"}>
                  {row[column.accessor]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
          {rows.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={columns.length} align="center">
                No data available
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default CustomTable
