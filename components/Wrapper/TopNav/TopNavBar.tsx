
import React from "react";
import { alpha, makeStyles } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button,Menu,MenuItem, AppBar, IconButton } from "@mui/material";
import { BsSearch } from "react-icons/bs"

// import OxusCare from "./oxusCare.js";
import Link from "next/link.js";


const useStyles:any = makeStyles((theme:any) => ({
   navmenu: {
      marginRight: theme.spacing(6),
      color: "#ddd"
   },
   grow: {
      flexGrow: 1,
   },
   menuButton: {
      marginRight: theme.spacing(2),
   },
   title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
         display: "block",
      },
   },
   search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
         backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
         marginLeft: theme.spacing(3),
         width: "auto",
      },
   },
   searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   inputRoot: {
      color: "inherit",
   },
   inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
         width: "20ch",
      },
   },
   sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
         display: "flex",
      },
   },
   sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
         display: "none",
      },
   },
}));

export default function Navbar() {
   const classes = useStyles();
   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

   const [openCare, setOpenCare] = React.useState(false);

   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

   const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
   };

   const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
   };


   const mobileMenuId = "primary-search-account-menu-mobile";
   const renderMobileMenu = (
      <Menu
         anchorEl={mobileMoreAnchorEl}
         anchorOrigin={{ vertical: "top", horizontal: "right" }}
         id={mobileMenuId}
         keepMounted
         transformOrigin={{ vertical: "top", horizontal: "right" }}
         open={isMobileMenuOpen}
         onClose={handleMobileMenuClose}
      >
         <Link href="/" passHref>
            <MenuItem>
               <p>Home</p>
            </MenuItem>
         </Link>
         <Link href="/Inventory">
            <MenuItem>
               <p>Inventory</p>
            </MenuItem>
         </Link>
         <Link href="/About">
            <MenuItem>
               <p>About</p>
            </MenuItem>
         </Link>
         <Link href="/Contact">
            <MenuItem>
               <p>Contact</p>
            </MenuItem>
         </Link>
         <Link onClick={() => setOpenCare(true)} href="#">
            <MenuItem>
               <p>Oxus Car Care</p>
            </MenuItem>
         </Link>
         <MenuItem>
            <BsSearch />
         </MenuItem>
      </Menu>
   );

   return (
      <div className={classes.grow}>
         <AppBar>
            <Toolbar>
            <Link href="/" passHref>
               <Typography variant="h6" noWrap>
                  <img src="/assets/logo.png" 
                  height="50"
                  width="150" 
                  alt="logo" />
               </Typography>
            </Link>
               <div className={classes.grow} />
               <div className={classes.sectionDesktop}>
                  <Typography className={classes.navmenu}>
                     <Link
                        className={classes.navmenu}
                        href="/" passHref
                     >
                        {" "}
                        Home{" "}
                     </Link>
                     <Link
                        className={classes.navmenu}
                        href="/Inventory"
                     >
                        {" "}
                        Inventory{" "}
                     </Link>
                     <Link
                        className={classes.navmenu}
                        href="/About"
                     >
                        {" "}
                        About{" "}
                     </Link>
                     <Link
                        className={classes.navmenu}
                        href="/Contact"
                     >
                        {" "}
                        Contact{" "}
                     </Link>
                     <Button
                        className={classes.navmenu}
                        onClick={() => setOpenCare(true)}
                        
                     >
                        {" "}
                        Oxus Car Care{" "}
                     </Button>
                     <Link
                        className={classes.navmenu}
                        href="/Inventory"
                     >
                        {" "}
                        Search
                        {/* <SearchIcon />{" "} */}
                     </Link>
                  </Typography>
               </div>
               <div className={classes.sectionMobile}>
                  <IconButton
                     aria-label="show more"
                     aria-controls={mobileMenuId}
                     aria-haspopup="true"
                     onClick={handleMobileMenuOpen}
                     color="inherit"
                  >
                     <MoreIcon />
                  </IconButton>
               </div>
            </Toolbar>
         </AppBar>
         {renderMobileMenu}
         {/* {renderMenu} */}
         {/* <OxusCare
            openCare={openCare}
            setOpenCare={setOpenCare} >

         </OxusCare> */}
      </div>

   );
}
