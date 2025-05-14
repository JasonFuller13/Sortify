import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SettingsIcon from "@mui/icons-material/Settings";
import Logo from "./../../Resources/Logo.png";
import "./buttonStyles.css";
import { useNavigate } from 'react-router-dom';


export default function SettingsDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("dashboard");
  const navigate = useNavigate();


  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#52B788", position: "relative" }}>
        <Toolbar>
          <div style={{ position: "absolute", display: "flex", alignItems: "center", left: 10, userSelect: "none" }}>
            <img src={Logo} alt="Sortify Logo" style={{ width: 50, height: 50, borderRadius: "50%", opacity: 0.8 }} />
            <h1 style={{ fontFamily: "Montserrat-Bold", fontSize: 24, fontWeight: "bold", color: "#000000", marginLeft: 10 }}>SORTIFY</h1>
          </div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginLeft: "2.2rem"}}>
            <a href="http://localhost:5173/dashboard" style={{ textDecoration: currentPage === "dashboard" ? "underline" : "none" }}>
              <button className="button" onClick={() => setCurrentPage("dashboard")}>
                Home
              </button>
            </a>
          </div>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            onClick={toggleDrawer(true)}
            color="inherit"
            size="large"
            edge="end"
          >
            <SettingsIcon style={{ fontSize: 30, color: "#081C15" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": { backgroundColor: "#52B788" },
        }}
      >
        <Box
          sx={{ width: 220 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={logout}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    bgcolor: "#4AA478",
                  },
                }}
              >
                <ListItemIcon sx={{ alignItems: "center", color: "#000000" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{
                    color: "#000000",
                    "& .MuiTypography-root": {
                      color: "inherit",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
            <ListItemButton
               onClick={() => navigate('/contact')}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  bgcolor: "#4AA478",
                },
              }}
            >
              <ListItemIcon sx={{ alignItems: "center", color: "#000000" }}>
                <ContactPageIcon /> 
              </ListItemIcon>
              <ListItemText
                primary="Contact"
                sx={{
                  color: "#000000",
                  "& .MuiTypography-root": {
                    color: "inherit",
                  },
                }}
              />
           </ListItemButton>
          </ListItem>
          </List>
          
        </Box>
      </Drawer>
    </>
  );
}
