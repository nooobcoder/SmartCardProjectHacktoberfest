import type { LEAVE_TYPES_OPTS } from '@/utils/consts';

type Order = 'asc' | 'desc';

interface Data {
  serialNumber: number;
  userId: number;
  attendanceId: number;
  status: LEAVE_TYPES_OPTS;
  attDate: string;
  attTime: string;
}

function createData(
  serialNumber: number,
  userId: number,
  attendanceId: number,
  status: LEAVE_TYPES_OPTS,
  attDate: string,
  attTime: string
): Data {
  return {
    serialNumber,
    userId,
    attendanceId,
    status,
    attDate,
    attTime,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'serialNumber',
    numeric: true,
    disablePadding: true,
    label: 'Sl',
  },
  {
    id: 'userId',
    numeric: true,
    disablePadding: false,
    label: 'User Id',
  },
  {
    id: 'attendanceId',
    numeric: true,
    disablePadding: false,
    label: 'Attendance ID',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'attDate',
    numeric: false,
    disablePadding: false,
    label: 'Attendance Date',
  },
  {
    id: 'attTime',
    numeric: false,
    disablePadding: false,
    label: 'Attendance Time',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export type { Data, EnhancedTableProps, EnhancedTableToolbarProps, Order };
export {
  createData,
  descendingComparator,
  getComparator,
  headCells,
  stableSort,
};
