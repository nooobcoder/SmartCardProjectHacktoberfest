import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || `https://localhost:5001`;
const WEBSOCKET_URL = process.env.WEBSOCKET_URL || `wss://localhost:5001/ws`;
interface Response {
  response: {
    message: string;
  };
  status: {
    code: string;
    message?: string;
  };
}

const triggers = [
  { name: `Create File`, url: `${BACKEND_URL}/readers/CreateFile` },
  { name: `Update File`, url: `${BACKEND_URL}/readers/UpdateBinary` },
  { name: `Select File`, url: `${BACKEND_URL}/readers/SelectFile` },
  { name: `Read File`, url: `${BACKEND_URL}/readers/ReadBinary` },
  { name: `Delete File`, url: `${BACKEND_URL}/readers/DeleteFile` },
];

const USER_PRIVILEGES: UserPrivelegesType = {
  Student: {
    id: 1,
    name: 'STU',
  },
  Teacher: {
    id: 2,
    name: 'TEA',
  },
  Parent: {
    id: 3,
    name: 'PAR',
  },
  Admin: {
    id: 4,
    name: 'ADM',
    className: `bg-orange-200 text-bold`, // Orange background, bold black text
  },
};

// Type declaration for triggers
type Trigger = { name: string; url?: string };

type Reader = {
  name: string;
};

type HeaderLink = {
  name: string;
  href: string;
  accessor: Array<string>;
};

type MenuProps = {
  active: boolean;
  onClick?: () => void;
};

interface SimpleDropdownProps {
  items: Array<Reader | Trigger | HeaderLink>;
  setSelectedItem: (setItem: Reader | Trigger | HeaderLink) => void;
  dropdownName?: string;
}

// Type declaration for USER_PRIVELEGES
type UserPrivelegesType = {
  [key: string]: {
    id: number;
    name: string;
    className?: string;
  };
};

// Type declaration
type Book = {
  bookId: number;
  googleBookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  bookYear: number;
  bookCount: number;
  entryDate: string;
  shelfId: number;
  thumbnail?: string;
};

const HEADER_LINKS: Array<HeaderLink> = [
  {
    href: '/dashboard',
    name: 'Dashboard',
    accessor: ['ADM', 'GEN', 'STU', 'TEA'],
  },
  {
    href: '/admin/createUser',
    name: 'Create User',
    accessor: ['ADM'],
  },
  {
    href: '/admin/updateUser',
    name: 'Update User',
    accessor: ['ADM'],
  },
  {
    href: '/poc',
    name: 'Project POC',
    accessor: ['ADM', 'GEN', 'STU'],
  },
  {
    href: '/exam/grades',
    name: 'Exam Grades',
    accessor: ['ADM', 'STU', 'TEA'],
  },
  {
    href: '/attendance',
    name: 'Attendance',
    accessor: ['ADM', 'STU', 'TEA'],
  },
  {
    href: '/library/books',
    name: 'Library',
    accessor: ['ADM', 'GEN', 'STU', 'TEA'],
  },
];

type LEAVE_TYPES_OPTS =
  | `SICK LEAVE`
  | `ABSENT`
  | `PRESENT`
  | `LEAVE`
  | `HOLIDAY`;

interface LeaveType {
  leaveTypeId: number;
  leaveType: LEAVE_TYPES_OPTS;
}

const getLeaveTypes = async (): Promise<Array<LeaveType>> => {
  // API_URL: database/GetLeaveTypes
  const response = await axios.get(`${BACKEND_URL}/database/GetLeaveTypes`);
  return response.data;
};

export type {
  Book,
  HeaderLink,
  LEAVE_TYPES_OPTS,
  LeaveType,
  MenuProps,
  Reader,
  Response,
  SimpleDropdownProps,
  Trigger,
  UserPrivelegesType
};
export {
  BACKEND_URL,
  getLeaveTypes,
  HEADER_LINKS,
  triggers,
  USER_PRIVILEGES,
  WEBSOCKET_URL,
};

