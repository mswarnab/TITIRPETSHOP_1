import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { DownOutlined } from '@ant-design/icons';
import { fontSize, Stack } from '@mui/system';

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
      return <AccordionNavItem menuItem={menuItem}/>
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
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
          <Box sx={{ pl: 3, mb: 1.5 }} >
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };

function AccordionNavItem ({menuItem}){
  return (
    // <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
    //   collapse - only available in paid version
    // </Typography>
    <Accordion style={{boxShadow:'none',marginLeft:10}}>
      <AccordionSummary
         expandIcon={<DownOutlined />}
        aria-controls="panel1-content"
        id="panel1-header"
      > 
      <Stack direction="row" spacing={1.5}>
        <div>
      {menuItem.icon({fontSize:16})}

        </div>
        <div>
      {menuItem.title}

        </div>
      </Stack>
      </AccordionSummary>
      <AccordionDetails>
        
        {menuItem.children.map((value)=>{
          return(
          <NavItem key={value.id} item={value} level={1} />
        );
        })}
      </AccordionDetails>
    </Accordion>
    // <></>
  );
}
