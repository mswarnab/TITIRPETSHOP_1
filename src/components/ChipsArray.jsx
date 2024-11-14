import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Autocomplete, Dialog, TextField } from '@mui/material';
import { useState } from 'react';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function ChipsArray() {
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Filter only due PO' },
    { key: 1, label: 'Filter only paid PO' },
    { key: 2, label: 'Search with Invoice No.' },
    { key: 3, label: 'Search with Supplier Name' }
  ]);

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

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
        boxShadow: 'none',
        border: '1px solid #f5f5f5'
      }}
      component="ul"
    >
      {chipData.map((data) => {
        return (
          <ListItem key={data.key}>
            <Chip label={data.label} variant="outlined" onClick={() => handleClick(data.key)} />
          </ListItem>
        );
      })}
      <Dialog open={searchWithInvoiceSwitch} />
    </Paper>
  );
}
