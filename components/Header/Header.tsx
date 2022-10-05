import Link from "next/link"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import styles from './Header.module.css'
import { Formik, useFormik } from 'formik'
import { Button, Dialog, TextField } from '@mui/material';
import * as Yup from 'yup'
import { string } from "yup/lib/locale";
import { MinimalPagePropsContext } from "../../pages/_app";
export const Header: React.FC = () => {
    const [isLoginRegisterDialogShown, setIsLoginRegisterDialogShown] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);
    // style={!isLoginForm ? { display: 'none' } : {}} 
    return (
        <header>
            <MinimalPagePropsContext.Consumer>
                {minimalPageProps =>
                    minimalPageProps.isLoggedIn
                        ? <p>{minimalPageProps.userName}</p>
                        : <button onClick={() => { setIsLoginRegisterDialogShown(!isLoginRegisterDialogShown) }}>
                            התחברות
                        </button>
                }
            </MinimalPagePropsContext.Consumer>

            <Dialog open={isLoginRegisterDialogShown}>
                <LoginForm isLoginForm={isLoginForm} setIsLoginForm={setIsLoginForm} />
                <RegistrationForm isLoginForm={isLoginForm} setIsLoginForm={setIsLoginForm} />
            </Dialog>
            <nav>
            </nav>
        </header >
    )
}


const onSubmitLoginForm = (e: FormEvent) => {
    e.preventDefault();
    let asForm = e.target as HTMLFormElement;
    console.log(asForm.form);
}

const LoginForm = (props: { isLoginForm: boolean, setIsLoginForm: Dispatch<SetStateAction<boolean>> }) => {
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
    return <form hidden={!props.isLoginForm} className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off" type="email" name="usernameOrEmail" label="אימייל" value={formik.values.usernameOrEmail} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="password" label="סיסמה" value={formik.values.password} onChange={formik.handleChange} />
        <Button type="submit" variant="contained">התחברות</Button>
        <Button variant="text" onClick={() => { props.setIsLoginForm(false) }}>מעוניינים להרשם?</Button>
    </form>
}

const RegistrationForm = (props: { isLoginForm: boolean, setIsLoginForm: Dispatch<SetStateAction<boolean>> }) => {
    const formik = useFormik({
        initialValues: { username: '', email: '', password: '', passwordConfirmation: '' },
        validationSchema: Yup.object({
            username: Yup
                .string()
                .required("הכניסו שם משתמש"),
            email: Yup.
                string()
                .email("האימייל שהזנתם אינו תקין")
                .required("אנא הזינו אימייל"),
            password: Yup
                .string()
                .min(8, "סיסמה צריכה להיות מינימום 8 תווים")
                .required("אנא הזינו סיסמה"),
            passwordConfirmation: Yup
                .string()
                .test("passwordMatchTest", "הסיסמאות אינן תואמות", function (value) {
                    console.log(this.parent.password, value)
                    return this.parent.password === value
                })
        }),
        onSubmit: (values, { setSubmitting }) => {
            let headers = new Headers();
            headers.append('content-type', 'application/json')
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/register", {
                method: 'POST',
                body: JSON.stringify(values),
                headers,
                mode: 'cors',
            }).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            })
        }
    })
    console.log(formik.errors)
    return <form hidden={props.isLoginForm} className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off" type="text" name="username" label="שם משתמש" value={formik.values.username} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="text" name="email" label="אימייל" value={formik.values.email} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="password" label="סיסמה" value={formik.values.password} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="passwordConfirmation" label="אימות סיסמה" value={formik.values.passwordConfirmation} onChange={formik.handleChange} />
        <Button type="submit" variant="contained">הרשמה</Button>
        <Button variant="text" onClick={() => { props.setIsLoginForm(true) }}>אתם כבר רשומים?</Button>
    </form>
}