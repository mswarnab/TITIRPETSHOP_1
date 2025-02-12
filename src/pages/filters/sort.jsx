import { ArrowDownOutlined, ArrowUpOutlined, CaretUpOutlined, SortAscendingOutlined, SwapOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Chip, Divider, Grid, Popover, Stack, Switch, TextField, Typography } from '@mui/material';

export default function CustomSort({ screenType = { PURCHASE, SALE, CUSTOMER, SUPPLIER }, createSortParm }) {
  const [sortObject, setSortObject] = useState({
    dateSort: '',
    grandTotalSort: '',
    creditedAmount: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    if (sortObject.creditedAmount || sortObject.grandTotalSort || sortObject.dateSort) {
      let sortType = '';
      let sortValue = '';
      if (sortObject.grandTotalSort) {
        sortType = 'sortByGrandTotalAmount';
        sortValue = sortObject.grandTotalSort;
      } else if (sortObject.creditedAmount) {
        sortType = 'sortByCreditAmount';
        sortValue = sortObject.creditedAmount;
      } else if (sortObject.dateSort) {
        sortType = 'sortByDate';
        sortValue = sortObject.dateSort;
      }
      // console.clear();
      // console.log(sortType + ' : ' + sortValue);
      createSortParm(sortType, sortValue);
    } else {
      createSortParm('', '');
    }
  }, [sortObject]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ marginRight: 10 }}>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        <SwapOutlined /> <span style={{ marginLeft: 10 }}>Sort</span>
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
        <Grid spacing={2} width={250}>
          <Grid direction="column" xs={12} md={12} lg={12}>
            <Grid style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#CECECE', height: 35 }}>
              <Typography margin={1}>Sort</Typography>
              <CloseOutlined style={{ color: 'red', margin: 7 }} onClick={handleClose} />
            </Grid>

            <Stack spacing={1.5} padding={1.5}>
              {/* <Grid item> */}
              {/* <Item>xs=6 md=8</Item> */}
              {screenType.PURCHASE || screenType.SALE ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5">Date of {screenType.PURCHASE ? 'purchase' : screenType.SALE ? 'sale' : 'Mota'}</Typography>
                    <div style={{ marginLeft: 10 }}>
                      {/* <SortAscendingOutlined /> */}
                      <ArrowDownOutlined
                        style={
                          sortObject.dateSort == 'ASC'
                            ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                            : { paddingLeft: 6, paddingRight: 6, fontSize: 15, transition: '0.2s' }
                        }
                        onClick={() => {
                          sortObject.dateSort == 'ASC'
                            ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                            : setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: 'ASC' });
                        }}
                      />
                      <ArrowUpOutlined
                        style={
                          sortObject.dateSort == 'DESC'
                            ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                            : { paddingLeft: 6, paddingRight: 6, fontSize: 15, transition: '0.2s' }
                        }
                        onClick={() => {
                          sortObject.dateSort == 'DESC'
                            ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                            : setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: 'DESC' });
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5">Grand Total Amount</Typography>
                    <div style={{ marginLeft: 10 }}>
                      {/* <SortAscendingOutlined /> */}
                      <ArrowDownOutlined
                        style={
                          sortObject.grandTotalSort == 'ASC'
                            ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                            : { paddingLeft: 6, paddingRight: 6, fontSize: 15, transition: '0.2s' }
                        }
                        onClick={() => {
                          sortObject.grandTotalSort == 'ASC'
                            ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                            : setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: 'ASC', dateSort: '' });
                        }}
                      />
                      <ArrowUpOutlined
                        style={
                          sortObject.grandTotalSort == 'DESC'
                            ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                            : { paddingLeft: 6, paddingRight: 6, fontSize: 15, transition: '0.2s' }
                        }
                        onClick={() => {
                          sortObject.grandTotalSort == 'DESC'
                            ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                            : setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: 'DESC', dateSort: '' });
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">Credit Amount</Typography>
                <div style={{ marginLeft: 10 }}>
                  {/* <SortAscendingOutlined /> */}
                  <ArrowDownOutlined
                    style={
                      sortObject.creditedAmount == 'ASC'
                        ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                        : { paddingLeft: 6, paddingRight: 6, fontSize: 15, transition: '0.2s' }
                    }
                    onClick={() => {
                      sortObject.creditedAmount == 'ASC'
                        ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                        : setSortObject({ ...sortObject, creditedAmount: 'ASC', grandTotalSort: '', dateSort: '' });
                    }}
                  />
                  <ArrowUpOutlined
                    style={
                      sortObject.creditedAmount == 'DESC'
                        ? { paddingLeft: 6, paddingRight: 6, color: 'green', fontSize: 20, transition: '0.2s' }
                        : { paddingLeft: 6, paddingRight: 6, fontSize: 15 }
                    }
                    onClick={() => {
                      sortObject.creditedAmount == 'DESC'
                        ? setSortObject({ ...sortObject, creditedAmount: '', grandTotalSort: '', dateSort: '' })
                        : setSortObject({ ...sortObject, creditedAmount: 'DESC', grandTotalSort: '', dateSort: '' });
                    }}
                  />
                </div>
              </div>

              {/* </Grid> */}
            </Stack>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}
