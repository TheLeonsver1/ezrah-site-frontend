import { Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'
import styles from './Header.module.css'

export const RegistrationForm = (props: {
    isLoginForm: boolean,
    setIsLoginForm: Dispatch<SetStateAction<boolean>>
}) => {
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
    let formDisplay = props.isLoginForm ? 'none' : '';
    return <form style={{ display: formDisplay }} className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off" type="text" name="username" label="שם משתמש" value={formik.values.username} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="text" name="email" label="אימייל" value={formik.values.email} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="password" label="סיסמה" value={formik.values.password} onChange={formik.handleChange} />
        <TextField autoComplete="off" type="password" name="passwordConfirmation" label="אימות סיסמה" value={formik.values.passwordConfirmation} onChange={formik.handleChange} />
        <Button type="submit" variant="contained">הרשמה</Button>
        <Button variant="text" onClick={() => { props.setIsLoginForm(true) }}>אתם כבר רשומים?</Button>
    </form>
}
