import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Grid, IconButton, Typography } from '@mui/material';
import { CloseCircleOutlined } from '@ant-design/icons';

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export default function DraggableDialog({ data, open, handleClose }) {
  const position = { x: 400, y: -100 };
  return (
    <React.Fragment>
      <Draggable defaultPosition={position}>
        <Paper elevation={20} style={{ position: 'absolute', zIndex: 999999, cursor: 'grab', display: open ? 'block' : 'none' }}>
          {/* <Typography variant={'h3'}>Try to drag me</Typography> */}
          <Grid container sx={{ justifyContent: 'center', paddingTop: 3 }}>
            <Typography variant="h3">Report</Typography>
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            <Grid>
              <Grid style={{ display: 'flex', justifyContent: 'flex-start' }} padding={1}>
                <Typography variant="h5" width={100}>
                  Total Sale:
                </Typography>
                <Typography variant="h5" paddingLeft={4} color={'cornflowerblue'}>
                  ₹{data.totalSaleAmount}
                </Typography>
              </Grid>
              <Grid style={{ display: 'flex', justifyContent: 'flex-start' }} padding={1}>
                <Typography variant="h6" width={100}>
                  Total Due:
                </Typography>
                <Typography variant="h6" paddingLeft={4} color="error">
                  ₹{data.totalDueAmount}
                </Typography>
              </Grid>
              <Grid style={{ display: 'flex', justifyContent: 'flex-start' }} padding={1}>
                <Typography variant="h6" width={100}>
                  Total Received:
                </Typography>
                <Typography variant="h6" paddingLeft={4} color={'cornflowerblue'}>
                  ₹{data.totalReceivedAmount}
                </Typography>
              </Grid>
              <Grid style={{ display: 'flex', justifyContent: 'flex-start' }} padding={1}>
                <Typography variant="h6" width={100}>
                  Total Profit:
                </Typography>
                <Typography variant="h6" paddingLeft={4} color={'cornflowerblue'}>
                  ₹{data.totalProfitAmount}
                </Typography>
              </Grid>
            </Grid>
            <IconButton
              aria-label="delete"
              color="error"
              size="large"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleClose()}
            >
              <CloseCircleOutlined />{' '}
            </IconButton>
          </Grid>

          {/* <IconButton></IconButton> */}
        </Paper>
      </Draggable>
      {/*         
      <Button variant="outlined" onClick={handleClickOpen}>
        Open draggable dialog
      </Button>
      <Paper PaperComponent={PaperComponent}>
        <div style={{ cursor: 'move' }} id="draggable-dialog-title">
          Subscribe
        </div>
      </Paper> */}
    </React.Fragment>
  );
}
