import { Alert, Button, Divider, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Image from 'assets/images/icons/logo/Titir Pet Logo.png';
import { client } from 'api/client';
import { redirect, useNavigate } from 'react-router-dom';
import LottieAnimation from 'components/loaderDog';

function AlertMessage({ open, severity, message, handleClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      key={'top' + 'center'}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

function Login() {
  const [userData, setUserData] = useState({ userName: '', password: '' });
  const [loginStatus, setLoginStatus] = useState(' ');
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWidth(navigator.userAgent.toString().toLocaleLowerCase().includes('windows'));
  }, [navigator.userAgent]);

  useEffect(() => {
    (async () => {
      await client.get('/auth');
      navigate('/');
      return () => {
        return null;
      };
    })();

    return () => {
      return null;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    client
      .post('/auth/login', { user: userData }, { withCredentials: true })
      .then((res) => {
        setLoginStatus('SUCCESS');
        return navigate('/');

        return null;
      })
      .catch((err) => setLoginStatus('FAILED'))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setLoginStatus(' ');
  };

  if (loading) {
    return <LottieAnimation login={true} />;
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        margin: 0,
        position: 'absolute',
        zIndex: 999999999999999
      }}
    >
      {loginStatus == 'SUCCESS' ? (
        <AlertMessage open={true} severity={'success'} message={'Login Successful !!'} handleClose={handleClose} />
      ) : loginStatus == 'FAILED' ? (
        <AlertMessage open={true} severity={'error'} message={'Login failed !!'} handleClose={handleClose} />
      ) : null}
      <Grid container rowSpacing={4.5} columnSpacing={2.75} justifyContent={'center'} alignItems={'center'}>
        {/* row 1 */}
        <Grid item xs={12} sm={6} md={8} lg={8} style={{ paddingTop: 200 }}>
          <Stack direction="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
            {width ? (
              <>
                <div>
                  <Typography style={{ textAlign: 'center' }} fontFamily={'cursive'} variant="h1">
                    Titir Pet Shop
                  </Typography>
                  <Typography variant="h5" fontFamily={'cursive'} color="grey" textAlign={'center'} marginTop={2}>
                    One stop pet solutions
                  </Typography>
                  <img src={Image} style={{ marginTop: '20px', width: '250px', height: '180px', marginLeft: 10 }} />
                </div>
                <Divider
                  style={{ padding: '150px 0.5px', marginRight: 50, marginLeft: 50, borderRadius: 50, backgroundColor: '#cccccc' }}
                  orientation="vertical"
                />
              </>
            ) : null}

            <Grid
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '80px 30px',
                // height: '450px',
                boxShadow: '2px 2px 10px  #cccccc'
              }}
            >
              <form onSubmit={(e) => handleSubmit(e)}>
                <Stack style={{ backgroundColor: 'white', paddingTop: 0 }}>
                  <h2 style={{ marginBottom: 40, marginTop: -20 }}>Login</h2>

                  <TextField
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: 0, width: '250px' }}
                    label="User ID"
                    onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                  />
                  <TextField
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: 30 }}
                    label="Password"
                    type="password"
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  />
                  <span style={{ marginTop: 10, color: '#999999', textAlign: 'end', cursor: 'pointer' }}>Forgot password</span>
                  <Button variant="contained" color="secondary" style={{ marginTop: 20 }} type="submit">
                    Login
                  </Button>
                </Stack>
              </form>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
