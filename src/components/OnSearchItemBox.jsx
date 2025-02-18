import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const OnSearchItemBox = ({
  data = { productName: '', purchasePrice: 0, quantity: '', sgst: 0, cgst: 0, mrp: 0, expDate: '', sellingPrice: 0, totalSellingPrice: 0 },
  result = true,
  selected = false,
  added = false,
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
          <Typography variant="h5">{added ? 'Sale' : 'Available'} Quantity:</Typography>
          <Typography variant="h5" margin={'2px 5px'} marginLeft={1} color={'peru'}>
            {data.quantity}
          </Typography>
        </Stack>
        <Stack direction={'row'}>
          {data.expDate ? (
            <>
              <Typography variant="h5">Expiry Date:</Typography>
              <Typography variant="h5" color={'peru'} marginLeft={1}>
                {dayjs(data.expDate).format('YYYY-MM-DD')}
              </Typography>
            </>
          ) : (
            ''
          )}
        </Stack>
      </Stack>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'}>
          <Typography variant="h5">Price per Unit including GST:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            ₹{parseFloat(parseFloat(data.purchasePrice) + parseFloat(data.sgst) + parseFloat(data.cgst)).toFixed(2)}
          </Typography>
        </Stack>
        <Stack direction={'row'}>
          <Typography variant="h5">MRP:</Typography>
          <Typography variant="h5" color={'peru'} marginLeft={1}>
            ₹{data.mrp}
          </Typography>
        </Stack>
      </Stack>
      {added && (
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'}>
            <Typography variant="h5">Selling Price per Unit:</Typography>
            <Typography variant="h5" color={'peru'} marginLeft={1}>
              ₹{parseFloat(data.sellingPrice)}
            </Typography>
          </Stack>
          <Stack direction={'row'}>
            <Typography variant="h5">Total Selling Price:</Typography>
            <Typography variant="h5" color={'peru'} marginLeft={1}>
              ₹{parseFloat(data.totalSellingPrice)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default OnSearchItemBox;
