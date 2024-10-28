import { RouterProvider, useNavigate } from 'react-router-dom';

// project import
import { loginRouter, router } from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { useEffect, useState } from 'react';
import { client } from 'api/client';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function OnlyCheck() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      client
        .get('/login', { withCredentials: true })
        .then((res) => setLoggedIn(res.data.status == '200' ? true : false))
        .catch((err) => navigate('/login'));
    })();
  }, []);
  return () => {
    return null;
  };
}
