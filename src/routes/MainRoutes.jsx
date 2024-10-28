import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ManageStock from '../pages/stock';
import PurchaseOrder from 'pages/purchaseOrder/AddPurchase';
import AddSale from 'pages/sales/addSale';
import AddCustomer from 'pages/customer/addCustomer';
import AddSupplier from 'pages/supplier/AddSupplier';
import ManageCustomer from 'pages/customer/CustomerUpdateView';
import ManageSupplier from 'pages/supplier/SupplierUpdateView';
import AddPurchase from 'pages/purchaseOrder/AddPurchaseFinal';
import Login from 'pages/login/Login';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/stock/manage',
      element: <ManageStock />
    },
    {
      path: '/purchaseorder/add',
      element: <PurchaseOrder />
    },
    {
      path: '/sale/add',
      element: <AddSale />
    },
    {
      path: '/customer/add',
      element: <AddCustomer />
    },
    {
      path: '/supplier/add',
      element: <AddSupplier />
    },
    {
      path: '/customer/manage',
      element: <ManageCustomer />
    },
    {
      path: '/supplier/manage',
      element: <ManageSupplier />
    },
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
