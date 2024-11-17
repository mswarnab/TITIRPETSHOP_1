import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Autocomplete, TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SlideDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => handleClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Use Google's location service?"}</DialogTitle>
      <DialogContent>
        <Autocomplete disablePortal options={{}} sx={{ width: 300 }} renderInput={(params) => <TextField {...params} label="Movie" />} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Disagree</Button>
        <Button onClick={() => handleClose()}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}
