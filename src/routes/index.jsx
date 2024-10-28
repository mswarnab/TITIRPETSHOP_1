import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoute from './LoginRoute';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });
const loginRouter = createBrowserRouter([LoginRoute], { basename: import.meta.env.VITE_APP_BASE_NAME_LOGIN });

export { router, loginRouter };
