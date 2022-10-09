import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import * as Yup from 'yup'
import styles from './Header.module.css'

export const LoginForm = (props: {
    isLoginForm: boolean,
    setIsLoginForm: Dispatch<SetStateAction<boolean>>
}) => {
    const formik = useFormik({
        initialValues: { usernameOrEmail: '', password: '' },
        validationSchema: Yup.object({
            usernameOrEmail: Yup
                .string()
                .required("שם משתמש הינו הכרחי"),
            password: Yup
                .string()
                .required("סיסמה הינה הכרחית")
        }),
        onSubmit: (values, { setSubmitting }) => {
            let headers = new Headers();
            headers.append('content-type', 'application/json')
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/login", {
                method: 'POST',
                body: JSON.stringify(values),
                headers,
                mode: 'cors',
                credentials: 'include' // cookie won't be added without this, keep this
            }).then((result) => {
                console.log("login success")
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            })
        }
    })
    console.log(formik.errors);
    let formDisplay = !props.isLoginForm ? 'none' : '';
    return <form style={{ display: formDisplay }} className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off" type="email" name="usernameOrEmail" label="אימייל" value={formik.values.usernameOrEmail} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="password" label="סיסמה" value={formik.values.password} onChange={formik.handleChange} />
        <Button type="submit" variant="contained">התחברות</Button>
        <Button variant="text" onClick={() => { props.setIsLoginForm(false) }}>מעוניינים להרשם?</Button>
    </form>
}