import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Typography } from '@mui/material';

export default function AlertDialog({ open, data, handleDelete, handleClose, entity }) {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={() => handleClose()} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle style={{ padding: '30px 40px', paddingBottom: 0 }} variant="h4">
          {'Do you want to delete the payment entry permanently?'}
        </DialogTitle>
        <DialogContent style={{ padding: '30px 40px' }}>
          <Grid container>
            <Grid container justifyContent={'space-between'}>
              <Grid display={'flex'}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  Payment Date:
                </Typography>
                <Typography variant="h6">{data.paymentDate}</Typography>
              </Grid>
              <Grid display={'flex'}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  Paid Amount:
                </Typography>
                <Typography variant="h6">{data.paidAmount}</Typography>
              </Grid>
              <Grid display={'flex'}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  Payment Mode:
                </Typography>
                <Typography variant="h6">{data.paymentMode}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent={'space-between'} mt={2}>
              <Grid display={'flex'}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  {entity == 'CUSTOMER' ? 'Customer Name:' : 'Supplier Name:'}
                </Typography>
                <Typography variant="h6">{data.supplierName}</Typography>
              </Grid>
              <Grid display={'flex'}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  Title:
                </Typography>
                <Typography variant="h6">{data.title}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: '30px 40px', paddingTop: 0 }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            CANCEL
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(data)} autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
