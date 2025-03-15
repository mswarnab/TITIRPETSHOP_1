import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function AddExpenseDialog({ open, handleAdd, handleClose, handleDelete, data, id }) {
  const [stateData, setStateData] = React.useState({ expenseName: '', expenseAmount: 0, expenseDate: '', expenseTitle: '' });

  const [stateId, setStateId] = React.useState(id);

  React.useEffect(() => {
    if (data) {
      setStateData({ ...data, expenseDate: dayjs(data.expenseDate) });
    }
  }, [data]);

  let checkUserInputTotalPaidvalue = (value) => {
    let regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      setStateData({ ...stateData, expenseAmount: value });
    }
  };
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle style={{ padding: '30px 30px 10px 30px' }}>
        <Typography variant="h4">{data ? 'DELETE Expense' : 'New Expense'}</Typography>
      </DialogTitle>
      <DialogContent style={{ padding: '0px 30px 0px 30px' }}>
        <Stack spacing={1}>
          <Typography>
            <TextField
              required
              margin="normal"
              id="expenseName"
              name="expenseName"
              label="Expense Name"
              type="text"
              fullWidth
              variant="outlined"
              disabled={data ? true : false}
              value={stateData.expenseName}
              onChange={(event) => {
                setStateData({ ...stateData, expenseName: event.target.value });
              }}
            />
          </Typography>
          <Typography>
            <TextField
              required
              margin="normal"
              id="paidAmount"
              name="paidAmount"
              label="Amount"
              type="text"
              fullWidth
              variant="outlined"
              disabled={data ? true : false}
              value={stateData.expenseAmount}
              onChange={(event) => {
                checkUserInputTotalPaidvalue(event.target.value);
              }}
            />
          </Typography>

          <Stack container style={{ marginTop: 20 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expense Date*"
                required
                name="expenseDate"
                format="DD-MM-YYYY"
                disabled={data ? true : false}
                value={stateData.expenseDate || null}
                onChange={(date, constext) => {
                  if (constext.validationError == null) {
                    setStateData({ ...stateData, expenseDate: date });
                  }
                }} //setPurchaseDate(dayjs('2020-01-02'))
              />
            </LocalizationProvider>
          </Stack>
          <Typography>
            <TextField
              margin="normal"
              id="expenseTitle"
              name="expenseTitle"
              label="Expense Title"
              type="text"
              fullWidth
              variant="outlined"
              value={stateData.expenseTitle}
              disabled={data ? true : false}
              onChange={(event) => {
                setStateData({ ...stateData, expenseTitle: event.target.value });
              }}
            />
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions style={{ padding: '20px 30px 30px 30px' }}>
        {data ? (
          <Button variant="outlined" color="error" onClick={() => handleDelete(id)}>
            DELETE
          </Button>
        ) : (
          <Button variant="outlined" color="success" onClick={() => handleAdd(stateData)}>
            Add
          </Button>
        )}

        <Button variant="outlined" color="error" onClick={() => handleClose()}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
