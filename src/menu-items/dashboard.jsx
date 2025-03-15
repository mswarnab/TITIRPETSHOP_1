// assets
import { DragOutlined } from '@ant-design/icons';

// icons

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: (padding) => <DragOutlined style={padding} />,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
