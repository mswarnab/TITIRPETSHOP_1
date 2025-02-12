import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Chip, Divider, Grid, Popover, Stack, Switch, TextField, Typography } from '@mui/material';
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

export default function CustomerFilter({ screenType = { PURCHASE, SALE, CUSTOMER, SUPPLIER }, createUrlFromFilter, searchFilterData }) {
  const [searchObject, setSearchObject] = useState({
    searchBySupplierName: '',
    searchByCustomerName: '',
    searchByInvoiceNo: '',
    searchByBillNo: '',
    onlyDue: 'N',
    fromDate: '',
    toDate: '',
    dateFilter: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    let newObj = searchObject;
    newObj.searchBySupplierName = searchFilterData.searchBySupplierName;
    newObj.searchByCustomerName = searchFilterData.searchByCustomerName;
    newObj.searchByInvoiceNo = searchFilterData.searchByInvoiceNo;
    newObj.searchByBillNo = searchFilterData.searchByBillNo;
    newObj.onlyDue = searchFilterData.onlyDue;
    newObj.fromDate = searchFilterData.fromDate;
    newObj.toDate = searchFilterData.toDate;
    newObj.dateFilter = searchFilterData.dateFilter;
    setSearchObject(newObj);

    return () => null;
  }, [searchFilterData]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (searchObject.dateFilter) {
      let newObj = { ...searchObject };
      newObj.toDate = dayjs();
      // console.log(dayjs().subtract(7, 'day').format('DD/MM/YYYY'));
      if (searchObject.dateFilter == 'week') {
        newObj.fromDate = dayjs().subtract(7, 'day');
      } else if (searchObject.dateFilter == 'month') {
        newObj.fromDate = dayjs().subtract(1, 'month');
      } else if (searchObject.dateFilter == 'quarter') {
        newObj.fromDate = dayjs().subtract(3, 'month');
      } else if (searchObject.dateFilter == 'year') {
        newObj.fromDate = dayjs().subtract(1, 'year');
      }
      setSearchObject(newObj);
    }
  }, [searchObject.dateFilter]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        <MenuOutlined /> <span style={{ marginLeft: 10 }}>Filter</span>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        style={{ marginTop: 10 }}
      >
        <Grid spacing={2} width={350}>
          <Grid direction="column" xs={12} md={12} lg={12}>
            <Grid style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#CECECE', height: 35 }}>
              <Typography margin={1}>Filter</Typography>
              <CloseOutlined style={{ color: 'red', margin: 7 }} onClick={handleClose} />
            </Grid>

            <Stack spacing={1.5} padding={1.5}>
              {/* <Grid item> */}
              {/* <Item>xs=6 md=8</Item> */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>
                  {screenType.PURCHASE
                    ? 'Supplier'
                    : screenType.SALE
                      ? 'Customer'
                      : screenType.SUPPLIER
                        ? 'Supplier'
                        : screenType.CUSTOMER
                          ? 'Customer'
                          : ''}
                  Name / No.
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    screenType.PURCHASE || screenType.SUPPLIER
                      ? setSearchObject({ ...searchObject, searchBySupplierName: '' })
                      : screenType.SALE || screenType.CUSTOMER
                        ? setSearchObject({ ...searchObject, searchByCustomerName: '' })
                        : null;
                  }}
                >
                  Clear
                </Button>
              </div>

              <TextField
                id="outlined-basic"
                name={
                  screenType.PURCHASE || screenType.SUPPLIER
                    ? 'searchBySupplierName'
                    : screenType.SALE || screenType.CUSTOMER
                      ? 'searchByCustomerName'
                      : ''
                }
                size="small"
                value={
                  screenType.PURCHASE || screenType.SUPPLIER
                    ? searchObject.searchBySupplierName
                    : screenType.SALE || screenType.CUSTOMER
                      ? searchObject.searchByCustomerName
                      : ''
                }
                onChange={(event) => {
                  let newObj = { ...searchObject };
                  let name = event.target.name;
                  let value = event.target.value;
                  newObj[name] = value;
                  setSearchObject(newObj);
                }}
              ></TextField>
              {screenType.PURCHASE || screenType.SALE ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{screenType.PURCHASE ? 'Invoice' : screenType.SALE ? 'BillNo' : ''} Search</Typography>{' '}
                    <Button
                      size="small"
                      onClick={() =>
                        screenType.PURCHASE
                          ? setSearchObject({ ...searchObject, searchByInvoiceNo: '' })
                          : screenType.SALE
                            ? setSearchObject({ ...searchObject, searchByBillNo: '' })
                            : ''
                      }
                    >
                      Clear
                    </Button>
                  </div>
                  <TextField
                    id="outlined-basic"
                    name={screenType.PURCHASE ? 'searchByInvoiceNo' : screenType.SALE ? 'searchByBillNo' : ''}
                    size="small"
                    value={screenType.PURCHASE ? searchObject.searchByInvoiceNo : screenType.SALE ? searchObject.searchByBillNo : null}
                    onChange={(event) =>
                      screenType.PURCHASE
                        ? setSearchObject({ ...searchObject, searchByInvoiceNo: event.target.value })
                        : screenType.SALE
                          ? setSearchObject({ ...searchObject, searchByBillNo: event.target.value })
                          : null
                    }
                  ></TextField>
                </>
              ) : null}
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Only Due</Typography>
                <Switch
                  size="small"
                  color="warning"
                  checked={searchObject.onlyDue == 'N' ? false : true}
                  onClick={() =>
                    searchObject.onlyDue == 'N'
                      ? setSearchObject({ ...searchObject, onlyDue: 'Y' })
                      : setSearchObject({ ...searchObject, onlyDue: 'N' })
                  }
                />
              </div>
              <Divider />
              {screenType.PURCHASE || screenType.SALE ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Date Range</Typography>{' '}
                    <Button size="small" onClick={() => setSearchObject({ ...searchObject, fromDate: '', toDate: '', dateFilter: '' })}>
                      Clear
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From"
                        name="fromDate"
                        // defaultValue={searchObject.fromDate ? searchObject.fromDate : dayjs('')}
                        value={dayjs(searchObject.fromDate)}
                        size="small"
                        format="DD/MM/YYYY"
                        onChange={(date) => setSearchObject({ ...searchObject, fromDate: date })}
                      />
                    </LocalizationProvider>
                    <Divider orientation="vertical" style={{ marginRight: 2 }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="To"
                        name="toDate"
                        // defaultValue={searchObject.toDate ? searchObject.toDate : dayjs('')}
                        value={dayjs(searchObject.toDate)}
                        size="small"
                        format="DD/MM/YYYY"
                        onChange={(date) => setSearchObject({ ...searchObject, toDate: date })}
                      />
                    </LocalizationProvider>
                    {/* <TextField id="outlined-basic" label="From" type="date" name="searchByInvoiceNo" size="small"></TextField>
                <TextField id="outlined-basic" label="To" type="date" name="searchByInvoiceNo" size="small"></TextField> */}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label="Week"
                      name="dateFilter"
                      size="small"
                      variant={searchObject.dateFilter == 'week' ? 'filled' : 'outlined'}
                      color="primary"
                      style={{ borderRadius: 20, padding: 10 }}
                      onClick={() =>
                        searchObject.dateFilter == 'week'
                          ? setSearchObject({ ...searchObject, dateFilter: '' })
                          : setSearchObject({ ...searchObject, dateFilter: 'week' })
                      }
                    />
                    <Chip
                      label="Month"
                      name="dateFilter"
                      size="small"
                      variant={searchObject.dateFilter == 'month' ? 'filled' : 'outlined'}
                      color="primary"
                      style={{ borderRadius: 20, padding: 10 }}
                      onClick={() =>
                        searchObject.dateFilter == 'month'
                          ? setSearchObject({ ...searchObject, dateFilter: '' })
                          : setSearchObject({ ...searchObject, dateFilter: 'month' })
                      }
                    />
                    <Chip
                      label="Quarter"
                      name="dateFilter"
                      size="small"
                      variant={searchObject.dateFilter == 'quarter' ? 'filled' : 'outlined'}
                      color="primary"
                      style={{ borderRadius: 20, padding: 10 }}
                      onClick={() =>
                        searchObject.dateFilter == 'quarter'
                          ? setSearchObject({ ...searchObject, dateFilter: '' })
                          : setSearchObject({ ...searchObject, dateFilter: 'quarter' })
                      }
                    />
                    <Chip
                      label="Year"
                      name="dateFilter"
                      size="small"
                      variant={searchObject.dateFilter == 'year' ? 'filled' : 'outlined'}
                      color="primary"
                      style={{ borderRadius: 20, padding: 10 }}
                      onClick={() =>
                        searchObject.dateFilter == 'year'
                          ? setSearchObject({ ...searchObject, dateFilter: '' })
                          : setSearchObject({ ...searchObject, dateFilter: 'year' })
                      }
                    />
                  </div>
                </>
              ) : null}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 5 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() =>
                    setSearchObject({
                      searchBySupplierName: '',
                      searchByCustomerName: '',
                      searchByInvoiceNo: '',
                      searchByBillNo: '',
                      onlyDue: 'N',
                      fromDate: '',
                      toDate: '',
                      dateFilter: ''
                    })
                  }
                >
                  Reset
                </Button>
                <Button variant="outlined" size="small" color="primary" onClick={() => createUrlFromFilter(searchObject)}>
                  Apply
                </Button>
              </div>
              {/* </Grid> */}
            </Stack>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}
