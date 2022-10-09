import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  DesktopDatePicker,
  MobileDatePicker,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import type { LeaveType } from '@/utils/consts';
import { BACKEND_URL } from '@/utils/consts';

interface Props {
  leaveTypes: Array<LeaveType>;
}

interface FormData {
  date: string;
  time: string;
  status: string;
  userId: string;
}

export default function AttendanceForm({ leaveTypes }: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    date: dayjs().format('YYYY-MM-DD'),
    time: dayjs().format('HH:mm:ss'),
    status: 'Present',
    userId: '',
  });

  // Supported Date type: YYYY-MM-DD
  // Supported Time type: HH:mm:ss
  const [dayValue, setDayValue] = useState<Dayjs | null>(dayjs());
  const handleDateChange = (newValue: Dayjs | null) => {
    setDayValue(newValue);
  };

  useEffect(() => {
    // Detect if device is a laptop or a mobile
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator?.userAgent) || false;
    setIsMobile(isMobile);
  }, [setIsMobile]);

  const addAttendanceToDatabase = async () => {
    // ATTENDANCE URL:  ${process.env.BACKEND_URL}/attendance/AddAttendance
    try {
      const response = await axios.post(
        `${BACKEND_URL}/attendance/AddAttendance`,
        formData
      );

      if (response.status === 200) {
        toast.success('Attendance added successfully!');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // console.log(err.config);
        // console.log(err.request);
        const errData = err.response.data as string;
        toast.error(errData, {
          duration: 5000,
          position: 'top-right',
        });
      } else {
        // Stock Error, handle accordingly.
      }
    }
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = new FormData(formRef.current!);

    const date = dayValue?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD');
    const time = dayValue?.format('HH:mm:ss') || dayjs().format('HH:mm:ss');

    setFormData({
      date: date,
      time: time,
      status: data.get('status') as string,
      userId: data.get('userId') as string,
    });

    // After the form data is set, submit the data to the database
    await addAttendanceToDatabase();
  };

  return (
    <Box
      component='form'
      sx={{
        '& .MuiTextField-root': {
          m: 1,
          width: '25ch',
        },
      }}
      noValidate
      autoComplete='off'
      onSubmit={onSubmit}
      ref={formRef}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        color='inherit'
        variant='overline'
        fontSize={20}
        component='div'
      >
        Add Attendance
      </Typography>
      <div>
        <InputLabel id='demo-select-small' htmlFor='status'>
          Attendance/Leave Type
        </InputLabel>
        <Select
          labelId='demo'
          id='demo'
          name='status'
          value={formData.status || leaveTypes[0].leaveType}
          label='Attendance/Leave Type'
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as string })
          }
        >
          {leaveTypes?.map((leaveType: LeaveType) => (
            <MenuItem key={leaveType.leaveTypeId} value={leaveType.leaveType}>
              {leaveType.leaveType}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <TextField
          required
          id='outlined-required'
          label='Student Id'
          name='userId'
          type='text'
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            {!isMobile ? (
              <DesktopDatePicker
                label='Attendance Date'
                inputFormat='MM/DD/YYYY'
                value={dayValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            ) : (
              <MobileDatePicker
                label='Attendance Date'
                inputFormat='MM/DD/YYYY'
                value={dayValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            <TimePicker
              label='Attendance Time'
              value={dayValue}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
        <Button variant='outlined' color='primary' onClick={onSubmit}>
          Submit
        </Button>
      </div>
      <Toaster
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </Box>
  );
}
