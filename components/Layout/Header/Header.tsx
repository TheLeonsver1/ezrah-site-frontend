import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { useFormik } from 'formik'
import { AppBar, Avatar, Box, Button, Dialog, IconButton, Link, Menu, TextField, Toolbar, Tooltip } from '@mui/material';
import { MinimialPageProps } from "../../../pages/_app";
import { default as NextLink } from "next/link";
import { Stack } from "@mui/system";
import { blue } from "@mui/material/colors";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";
import { AvatarSubMenu } from "./AvatarSubMenu";
export const Header: React.FC<MinimialPageProps> = (props) => {
    //true = the login/register dialog is shown, false = not shown
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    //true = user is in the login form, false = in the registration form
    const [isInLogin, setInLogin] = useState(true);
    return (
        <>
            <AppBar position="sticky">

                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NextLink href="/">
                        <Link>בית</Link>
                    </NextLink>
                    {
                        props.isLoggedIn && props.userName
                            ? <AvatarSubMenu userName={props.userName} />
                            : <Button variant="contained"
                                onClick={() => {
                                    setShowLoginDialog(!showLoginDialog)
                                }}>
                                התחברות
                            </Button>
                    }


                </Toolbar>
            </AppBar>
            <Dialog open={showLoginDialog} onClose={() => { setShowLoginDialog(false) }}>
                <LoginForm isLoginForm={isInLogin} setIsLoginForm={setInLogin} />
                <RegistrationForm isLoginForm={isInLogin} setIsLoginForm={setInLogin} />
            </Dialog>
        </>
    )
}


const onSubmitLoginForm = (e: FormEvent) => {
    e.preventDefault();
    let asForm = e.target as HTMLFormElement;
    console.log(asForm.form);
}


