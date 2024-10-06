// assets
import { DashboardFilled } from '@ant-design/icons';

// icons
const icons = {
  DashboardFilled
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardFilled,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
