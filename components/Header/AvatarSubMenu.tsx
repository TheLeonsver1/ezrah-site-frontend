import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import React from "react";

const avatarMenuLinks = ['פרופיל', 'הגדרות', 'מנהל התראות'];

export const AvatarSubMenu: React.FC<{ userName: string }> = (props) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: blue[500] }}>{props.userName?.charAt(0).toUpperCase()}</Avatar>                                    </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                {...{ id: "menu-appbar" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {avatarMenuLinks.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}