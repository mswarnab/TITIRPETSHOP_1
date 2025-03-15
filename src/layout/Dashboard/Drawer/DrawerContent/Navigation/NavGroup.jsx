import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { DownCircleOutlined, DownOutlined, MoneyCollectOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Stack } from '@mui/system';
import { useState } from 'react';

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NestedList menuItem={menuItem} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={0.5} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 2 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };

function AccordionNavItem({ menuItem }) {
  return (
    // <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
    //   collapse - only available in paid version
    // </Typography>
    <Accordion style={{ boxShadow: 'none', marginLeft: 10 }}>
      <AccordionSummary expandIcon={<DownOutlined />} aria-controls="panel1-content" id="panel1-header">
        <Stack direction="row" spacing={1.5}>
          <div>{menuItem.icon({ fontSize: 16 })}</div>
          <div>Swarnab</div>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {menuItem.children.map((value) => {
          return <NavItem key={value.id} item={value} level={1} />;
        })}
      </AccordionDetails>
    </Accordion>
    // <></>
  );
}

function NestedList({ menuItem }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      disablePadding
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{<MoneyCollectOutlined />}</ListItemIcon>
        <ListItemText primary={menuItem.title} />
        {open ? <UpCircleOutlined /> : <DownCircleOutlined />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {menuItem.children.map((value) => {
          return (
            <List component="div" disablePadding sx={{ bottomBorder: '1px solid Black' }}>
              <NavItem key={value.id} item={value} level={1} />
            </List>
          );
        })}
      </Collapse>
    </List>
  );
}
