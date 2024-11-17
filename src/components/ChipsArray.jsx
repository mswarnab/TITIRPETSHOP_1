import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Autocomplete, Dialog, TextField } from '@mui/material';
import { useState } from 'react';
import { Button } from 'antd';
import FloatingButton from './FloatingButton';
import SpeedDial from '@mui/material/SpeedDial';
import { CloseOutlined, FilterOutlined, PrinterOutlined } from '@ant-design/icons';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SlideDialog from './SlideDialog';

// const ListItem = styled('li')(({ theme }) => ({
//   margin: theme.spacing(0.5)
// }));

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2)
  }
}));

export default function ChipsArray() {
  const [open, setOpen] = useState(false);
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Filter only due PO' },
    { key: 1, label: 'Filter only paid PO' },
    { key: 2, label: 'Search with Invoice No.' },
    { key: 3, label: 'Search with Supplier Name' }
  ]);
  const actions = [
    { icon: <PrinterOutlined />, name: 'Invoice No' },
    { icon: <PrinterOutlined />, name: 'Supplier Name' },
    { icon: <PrinterOutlined />, name: 'Only Due' },
    { icon: <PrinterOutlined />, name: 'Only Paid' }
  ];

  const [searchWithInvoiceSwitch, setSearchWithInvoiceSwitch] = useState(false);
  const [searchWithSupplierSwitch, setSearchWithSupplierSwitch] = useState(false);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleClick = (key) => {
    if (key.toString() == '2') {
      setSearchWithInvoiceSwitch(true);
    }
    if (key.toString() == '3') {
      setSearchWithSupplierSwitch(true);
    }
  };

  const [direction, setDirection] = React.useState('up');
  const [hidden, setHidden] = React.useState(false);

  const handleDirectionChange = (event) => {
    setDirection(event.target.value);
  };

  // const handleHiddenChange = (event) => {
  //   setHidden(event.target.checked);
  // };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* // <Paper
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     flexWrap: 'wrap',
    //     listStyle: 'none',
    //     p: 0.5,
    //     m: 0,
    //     boxShadow: 'none',
    //     border: '1px solid #f5f5f5'
    //   }}
    //   component="ul"
    // >
    //   {chipData.map((data) => {
    //     return (
    //       <ListItem key={data.key}>
    //         <Chip label={data.label} variant="outlined" onClick={() => handleClick(data.key)} />
    //       </ListItem>
    //     );
    //   })} */}
      <StyledSpeedDial
        ariaLabel="SpeedDial playground example"
        hidden={hidden}
        closeIcon={<CloseOutlined />}
        icon={<FilterOutlined />}
        direction={direction}
      >
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipOpen tooltipTitle={action.name} onClick={handleClickOpen} />
        ))}
        {/* <Autocomplete disablePortal options={{}} sx={{ width: 300 }} renderInput={(params) => <TextField {...params} label="Movie" />} /> */}
      </StyledSpeedDial>
      <SlideDialog open={open} handleClose={() => setOpen(false)} />
    </>
    // </Paper>
  );
}
