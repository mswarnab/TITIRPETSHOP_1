import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const OnSearchItemBox = ({
  data = { productName: '', quantity: '', sgst: 0, cgst: 0, mrp: 0, expDate: '' },
  result = true,
  selected = false,
  onSelect,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  //   const [isSelected, setIsSelected] = useState(false);
  return (
    <Box
      sx={{
        padding: '10px 20px',
        cursor: 'pointer',
        // border: '1px solid #cccccc',
        boxShadow: '1px 1px 10px #cccccc',
        borderRadius: '5px',
        backgroundColor: isHovered || selected ? '#f7f4e9' : 'white',
        marginBottom: '10px',
        transition: '0.3s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // setIsSelected(!isSelected);
        onSelect(data);
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction={'row'}>
          <Typography variant="h5">Name:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            {data.productName}
          </Typography>
        </Stack>
        {result && (
          <IconButton color="error" size="medium" variant="standard" onClick={() => onDelete(data?._id)}>
            <DeleteOutlined />
          </IconButton>
        )}
      </div>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'}>
          <Typography variant="h5">Available Quantity:</Typography>
          <Typography variant="h5" margin={'2px 5px'} marginLeft={1} color={'peru'}>
            {data.quantity}
          </Typography>
        </Stack>
        <Stack direction={'row'}>
          <Typography variant="h5">Expiry Date:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            {dayjs(data.expDate).format('YYYY-MM-DD')}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'}>
          <Typography variant="h5">Price per Unit including GST:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            ₹{parseFloat(data.rate) + parseFloat(data.sgst) + parseFloat(data.cgst)}
          </Typography>
        </Stack>
        <Stack direction={'row'}>
          <Typography variant="h5">MRP:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            ₹{data.mrp}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OnSearchItemBox;
