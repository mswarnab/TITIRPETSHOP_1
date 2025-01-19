import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { client } from 'api/client';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const avoidMenuAndHeaderFromSuchPages = ['customerbill', 'login'];
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await client.get('/auth', { withCredentials: true });
        if (response.data.status == '200') {
          setLoggedIn(true);
          return navigate(window.location.pathname);
        }
      } catch (error) {
        setLoggedIn(false);
        return navigate('/login');
      }
    })();
    return () => {
      return null;
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      return navigate('/login');
    } else {
      return navigate(window.location.pathname);
    }
  }, [loggedIn]);
  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;
  const currentPath = window.location.pathname;
  let urlArr = currentPath.split('/');
  let page = urlArr[1];
  let avoidMenuAndHeaderFromSuchPagesexists = avoidMenuAndHeaderFromSuchPages.indexOf(page) !== -1;
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {avoidMenuAndHeaderFromSuchPagesexists ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <Drawer />
          <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
            <Toolbar />
            <Breadcrumbs navigation={navigation} title />
            <Outlet />
          </Box>
        </>
      )}
    </Box>
  );
}
