import { gql } from "@apollo/client";
import { FilterList, Send } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, CardHeader, IconButton, Link, List, ListItem, MenuItem, Select, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GetServerSideProps, NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Bill, DEFAULT_LOGGED_IN_USER_PROPS, isAuthenticatedUser, LoggedInUser, LoggedInUserProp, UserPost } from "../../data/types";
import { frontendGraphqlClient, serverQueryGraphql } from "../../utils/graphQLApiUtils";

const SpecificBillPage: NextPage<SpecificBillPageProps> = (props) => {
    const [isSnackbarOpen, setIsSnackBarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [newBillComment, setNewBillComment] = useState("");
    const [billComments, setBillComments] = useState(props.billComments ?? [])

    const openSnackBar = (message: string) => {
        setIsSnackBarOpen(true);
        setSnackbarMessage(message);
    }

    let proposalNumber;
    if (props.bill?.privateNumber && props.bill?.knessetNum) {
        proposalNumber = `פ/${props.bill?.privateNumber}/${props.bill?.knessetNum}`
    } else if (props.bill?.governmentalNumber) {
        proposalNumber = `מ/${props.bill.governmentalNumber}`
    }
    return (
        <Layout {...props.loggedInUser}>
            <Stack spacing={3}>
                <Typography variant="h1">הצעת חוק: {props.bill?.name}</Typography>
                <Link href={`https://main.knesset.gov.il/Activity/Legislation/Laws/Pages/LawBill.aspx?t=lawsuggestionssearch&lawitemid=${props.bill?.knsBillId}`}>עמוד הצעת החוק באתר הכנסת</Link>
                {proposalNumber && <Typography variant="body2">{proposalNumber}</Typography>}
                {props.bill?.officialLawSummary
                    && <Box component="section" >
                        <Typography variant="h2">תקציר רשמי:</Typography>
                        <Typography variant="body1" sx={{ WebkitLineClamp: 5 }}>{props.bill.officialLawSummary}</Typography>
                    </Box>
                }
                <Stack direction='row' width='100%'>
                    <Tooltip placement="bottom-end" title={!props.loggedInUser.isLoggedIn ? 'אנא התחברו כדי להגיב' : undefined}>
                        <TextField disabled={!props.loggedInUser.isLoggedIn} sx={{ flexGrow: 1 }} multiline={true} label="יש לכם מה להגיד?" value={newBillComment} onChange={(e) => setNewBillComment(e.target.value)} />
                    </Tooltip>
                    <Tooltip placement="bottom-end" title={!props.loggedInUser.isLoggedIn ? 'אנא התחברו כדי להגיב' : 'הגיבו'}>
                        <span style={{ margin: 'auto' }}>
                            <IconButton disabled={!props.loggedInUser.isLoggedIn} onClick={() => { onClickSendComment(props.bill?.id, newBillComment, setNewBillComment, billComments, setBillComments, openSnackBar, props.loggedInUser); }}><Send sx={{ rotate: '180deg' }}></Send></IconButton>
                        </span>
                    </Tooltip>
                </Stack>
                <Stack alignContent='center' direction='row' spacing={2}>
                    <Typography sx={{ verticalAlign: 'middle' }} variant="h2">מה אחרים אומרים?</Typography>
                    <Tooltip title={!(props.billComments && props.billComments.length > 0) ? 'אין כרגע תגובות למיין' : undefined} >
                        <Select>
                            <MenuItem value={BillCommentsPaging.Hottest}>החמות ביותר</MenuItem>
                            <MenuItem value={BillCommentsPaging.Newest}>החדשות ביותר</MenuItem>
                        </Select>
                        {/* <span><IconButton disabled={!(props.billComments && props.billComments.length > 0)} size="small"><FilterList ></FilterList></IconButton></span> */}
                    </Tooltip>
                </Stack>
                <List>
                    {billComments.length > 0
                        ? billComments.map(billComment => <ListItem key={billComment.id}>
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
            </Stack>
            <Snackbar open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => { setIsSnackBarOpen(false) }}
                message={snackbarMessage}></Snackbar>
        </Layout >
    )
}

export default SpecificBillPage;

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
                    officialLawSummary
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