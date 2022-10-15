import { gql } from "@apollo/client";
import { FilterList, Send } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, Card, CardContent, CardHeader, IconButton, Link, List, ListItem, MenuItem, Select, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GetServerSideProps, NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { css } from '@emotion/react'
import Layout from "../../components/Layout/Layout";
import MuiNextLink from "../../components/MuiNextLink";
import { Bill, DEFAULT_LOGGED_IN_USER_PROPS, isAuthenticatedUser, LoggedInUser, LoggedInUserProp, UserPost } from "../../data/types";
import { frontendGraphqlClient, serverQueryGraphql } from "../../utils/graphQLApiUtils";
import styles from '../../styles/SpecificBill.module.css';

const SpecificBillPage: NextPage<SpecificBillPageProps> = (props) => {
    console.log(props.bill?.billInitiators)
    const [isSnackbarOpen, setIsSnackBarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [billComments, setBillComments] = useState(props.billComments ?? [])

    const openSnackBar = (message: string) => {
        setIsSnackBarOpen(true);
        setSnackbarMessage(message);
    }

    return (
        <Layout {...props.loggedInUser}>
            <Stack spacing={3}>
                <Typography variant="h1">הצעת חוק: {props.bill?.name}</Typography>
                <LinkToKnessetUrl {...props} />
                <BillNumber {...props} />
                <BillOfficialSummary {...props} />
                <BillInitiators {...props} />
                <AddComment {...props} billComments={billComments} openSnackBar={openSnackBar} setBillComments={setBillComments} />
                <BillComments {...props} billComments={billComments} />
            </Stack>
            <Snackbar open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => { setIsSnackBarOpen(false) }}
                message={snackbarMessage}></Snackbar>
        </Layout >
    )
}

export default SpecificBillPage;

const LinkToKnessetUrl: React.FC<SpecificBillPageProps> = (props) => {
    if (props.bill?.knsBillId) {
        return <Link href={`https://main.knesset.gov.il/Activity/Legislation/Laws/Pages/LawBill.aspx?t=lawsuggestionssearch&lawitemid=${props.bill?.knsBillId}`}>עמוד הצעת החוק באתר הכנסת</Link>
    }
    else {
        return <></>
    }
}

const BillNumber: React.FC<SpecificBillPageProps> = (props) => {
    let proposalNumber;
    if (props.bill?.privateNumber && props.bill?.knessetNum) {
        proposalNumber = `פ/${props.bill?.privateNumber}/${props.bill?.knessetNum}`
    } else if (props.bill?.governmentalNumber) {
        proposalNumber = `מ/${props.bill.governmentalNumber}`
    }
    if (proposalNumber) {
        return <Typography variant="body2">{proposalNumber}</Typography>
    } else {
        return <></>
    }
}

const BillOfficialSummary: React.FC<SpecificBillPageProps> = (props) => {
    if (props.bill?.officialLawSummary) {
        return <Box component="section" >
            <Typography variant="h2">תקציר רשמי:</Typography>
            <Typography variant="body1" sx={{ WebkitLineClamp: 5 }}>{props.bill.officialLawSummary}</Typography>
        </Box>;
    }
    else {
        return <></>
    }
}

const BillInitiators: React.FC<SpecificBillPageProps> = (props) => {
    if (props.bill?.billInitiators && props.bill.billInitiators.length > 0) {
        return (
            <section>
                <Typography variant="h2">מארגני ההצעה</Typography>
                <ul className={styles.list}>
                    {props.bill?.billInitiators?.map(initiator => (
                        <li key={initiator.person?.id}>
                            <MuiNextLink href={`/persons/${initiator.person.id}`}>
                                {initiator.person.firstName + " " + initiator.person.lastName}
                            </MuiNextLink>
                        </li>
                    ))}
                </ul>
            </section >
        )
    } else {
        return <></>
    }
}

const AddComment: React.FC<SpecificBillPageProps & { billComments: UserPost[], setBillComments: Dispatch<SetStateAction<UserPost[]>>, openSnackBar: (message: string) => void }> = (props) => {
    const [newBillComment, setNewBillComment] = useState("");

    return (
        <Stack direction='row' spacing={4} width='100%'>
            <Tooltip placement="bottom-end" title={!props.loggedInUser.isLoggedIn ? 'אנא התחברו כדי להגיב' : undefined}>
                <TextField disabled={!props.loggedInUser.isLoggedIn} sx={{ flexGrow: 1 }} multiline={true} label="יש לכם מה להגיד?" value={newBillComment} onChange={(e) => setNewBillComment(e.target.value)} />
            </Tooltip>
            <Button variant="contained" disabled={!props.loggedInUser.isLoggedIn} onClick={() => { onClickSendComment(props.bill?.id, newBillComment, setNewBillComment, props.billComments, props.setBillComments, props.openSnackBar, props.loggedInUser); }}>{props.loggedInUser.isLoggedIn ? 'הוסיפו תגובה' : 'התחברו כדי להגיב'}</Button>

            {/* <Tooltip placement="bottom-end" title={!props.loggedInUser.isLoggedIn ? 'אנא התחברו כדי להגיב' : 'הגיבו'}>
            <span style={{ margin: 'auto' }}>
                <IconButton disabled={!props.loggedInUser.isLoggedIn} onClick={() => { onClickSendComment(props.bill?.id, newBillComment, setNewBillComment, props.billComments, props.setBillComments, props.openSnackBar, props.loggedInUser); }}><Send sx={{ rotate: '180deg' }}></Send></IconButton>
            </span>
        </Tooltip> */}
        </Stack>
    );
}

const onClickSendComment = (
    billId: number | undefined,
    commentText: string,
    setCommentText: Dispatch<SetStateAction<string>>,
    billComments: UserPost[],
    setBillComments: Dispatch<SetStateAction<UserPost[]>>,
    openSnackBar: Function,
    loggedInUser: LoggedInUser
) => {
    if (!billId || !isAuthenticatedUser(loggedInUser)) {
        return;
    } else {
        frontendGraphqlClient.mutate<{ addBillComment: { id: number } }>({
            mutation: gql` 
                mutation AddBillComment($billId: ID!, $commentText: String) {
                    addBillComment(billId: $billId, commentText:$commentText){
                        id,
                    }
                }
            `, variables: {
                billId,
                commentText
            }

        }).then((res) => {
            if ((!res.errors || res.errors.length == 0) && res.data) {
                openSnackBar('תגובה נוספה')
                setBillComments([{
                    id: res.data.addBillComment.id,
                    latestContentVersion: commentText, createdDate: new Date().toISOString(), lastModifiedDate: new Date().toISOString(),
                    postCreator: {
                        id: loggedInUser.userId,
                        username: loggedInUser.userName
                    }
                }, ...billComments])
                setCommentText('');
            } else {
                openSnackBar('הוספת תגובה נכשלה')
            }

        }).catch(() => {
            openSnackBar('הוספת תגובה נכשלה')
        })
    }

}

const BillComments: React.FC<SpecificBillPageProps & { billComments: UserPost[] }> = (props) => {
    return (
        <Box component='section'>
            <Stack alignContent='center' direction='row' spacing={2}>
                <Typography sx={{ verticalAlign: 'middle' }} variant="h2">מה חושבים?</Typography>
                <Tooltip title={!(props.billComments && props.billComments.length > 0) ? 'אין כרגע תגובות למיין' : undefined} >
                    <Select>
                        <MenuItem value={BillCommentsPaging.Hottest}>החמות ביותר</MenuItem>
                        <MenuItem value={BillCommentsPaging.Newest}>החדשות ביותר</MenuItem>
                    </Select>
                    {/* <span><IconButton disabled={!(props.billComments && props.billComments.length > 0)} size="small"><FilterList ></FilterList></IconButton></span> */}
                </Tooltip>
            </Stack>
            <List>
                {props.billComments.length > 0
                    ? props.billComments.map(billComment => <ListItem key={billComment.id}>
                        <Card sx={{ width: '100%' }}>
                            <CardHeader avatar={
                                <Avatar>{billComment.postCreator?.username.charAt(0).toUpperCase()}</Avatar>
                            } title={`${billComment.postCreator?.username}`} subheader={`${new Date(billComment.createdDate).toLocaleString('he')}`}>
                            </CardHeader>
                            <CardContent>
                                {billComment.latestContentVersion}
                            </CardContent>
                        </Card>
                    </ListItem>)
                    : <ListItem disablePadding={true}><Card sx={{ width: '100%' }}><CardContent>אין כרגע תגובות על הצעת החוק הזו, תהיו הראשונים!</CardContent></Card></ListItem>}
            </List>
        </Box>
    );

}

const enum BillCommentsPaging {
    Hottest = 0,
    Newest = 1,
    MostEnlightening = 2,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log(context.query.billId);
    const props = await serverQueryGraphql<SpecificBillPageProps>(context, {
        query: gql`
            query Bill($id: ID!){
                loggedInUser{
                    userId,
                    isLoggedIn,
                    userName
                }

                bill: getBill(id: $id) {
                    id,
                    name,
                    knsLastUpdatedDate,
                    officialLawSummary,
                    billInitiators {
                        person {
                            id,
                            firstName,
                            lastName,
                        },
                        isInitiator
                    }
                }
                
                billComments: getBillComments(billId: $id) {
                    id,
                    latestContentVersion,
                    createdDate,
                    lastModifiedDate,
                    postCreator {
                        id, 
                        username
                    }
                }
            }
        `,
        variables: {
            id: context.query.billId
        }
    }, {
        ...DEFAULT_LOGGED_IN_USER_PROPS
    })
    return {
        props: props,
        notFound: !props.bill
    }
}

type SpecificBillPageProps = LoggedInUserProp & {
    bill?: Bill,
    billComments?: UserPost[],
}

