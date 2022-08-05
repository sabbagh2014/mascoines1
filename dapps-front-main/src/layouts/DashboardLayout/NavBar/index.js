/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";

// import AccessAlarmIcon  from '@material-ui/icons/AccessAlarm';
import {
  FaSignOutAlt,
  FaUserCircle,
  FaSignInAlt,
  FaUser,
  FaQuestionCircle,
  FaCheckSquare,
  FaExchangeAlt,
  FaPoll,
  FaRegEdit,
} from "react-icons/fa";
// import {GrTransaction} from 'react-icons/gr';
import { AiFillSetting } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import { PieChart as PieChartIcon } from "react-feather";
import { RiDashboardFill } from "react-icons/ri";
import NavItem from "./NavItem";
const sections = [
  {
    subheader: "Explore",
    items: [
      {
        title: "All",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Art",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Photography",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Games",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Metaverses",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Music",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Domains",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "DeFi",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Memes",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Punks",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "NSFW",
        icon: FaUserCircle,
        href: "/cc",
      },
    ],
  },
  {
    subheader: "More",
    items: [
      {
        title: "Top Sellers",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Live Auctions",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Hot Bids",
        icon: FaUserCircle,
        href: "/cc",
      },
      {
        title: "Hot Collections",
        icon: FaUserCircle,
        href: "/cc",
      },
    ],
  },
];

function renderNavItems({ items, ...props }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, ...props }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth = 0,
  isNested = false,
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
          isNested: true,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={<div style={{ textAlign: "left" }}>{item.title}</div>}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256,
    background: "#fff",
  },
  desktopDrawer: {
    width: 256,
    position: "absolute",
    top: 80,
    zIndex: 1,
    background: "transparent",
    overflow: "hidden",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
  socialIcon: {
    cursor: "pointer",
    marginRight: 5,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box py={4}>
          {sections.map((section, i) => (
            <List
              key={`menu${i}`}
              subheader={
                <ListSubheader
                  disableGutters
                  disableSticky
                  style={{
                    paddingLeft: "15px",
                    fontSize: "13px",
                    fontWeight: "300",
                  }}
                >
                  {section.subheader}
                </ListSubheader>
              }
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname,
              })}
            </List>
          ))}
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          posittion="absolute"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
          posittion="absolute"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
