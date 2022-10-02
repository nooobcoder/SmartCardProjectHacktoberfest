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
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import type { LeaveType } from '@/utils/consts';

interface Props {
  leaveTypes: Array<LeaveType>;
}

export default function AttendanceForm({ leaveTypes }: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [_formData, setFormData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    time: dayjs().format('HH:mm:ss'),
    status: 'Present',
    studentId: '',
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

  const onSubmit = (
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
      studentId: data.get('studentId') as string,
    });
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
          value={leaveTypes[2]?.leaveType}
          label='Attendance/Leave Type'
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
          name='studentId'
          type='text'
        />
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            {!isMobile ? (
              <DesktopDatePicker
                label='Date desktop'
                inputFormat='MM/DD/YYYY'
                value={dayValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            ) : (
              <MobileDatePicker
                label='Date mobile'
                inputFormat='MM/DD/YYYY'
                value={dayValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            <TimePicker
              label='Time'
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
    </Box>
  );
}
