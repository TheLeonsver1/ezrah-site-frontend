import { NotificationAdd } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, Chip, IconButton, Link, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Bill, LoggedInUserProp } from "../../data/types";

export type BillTableProps = {
    lastUpdatedBills: Bill[],
} & LoggedInUserProp;

const BillTable: React.FC<BillTableProps> = (props) => {
    return (
        <Card>
            <CardContent>
                <Box component="div">
                    <Typography variant='h2'>הצעות חוק שעודכנו לאחרונה</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>מעקב</TableCell>
                                <TableCell>שם ההצעה</TableCell>
                                <TableCell>פרטית/ ממשלתית</TableCell>
                                <TableCell>תאריך עדכון אחרון</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.lastUpdatedBills?.map((bill) =>
                                    <TableRow key={bill.id}>
                                        <TableCell><IconButton disabled={!props.loggedInUser.isLoggedIn}><NotificationAdd></NotificationAdd></IconButton></TableCell>
                                        <TableCell><Link href={`/bills/${bill.id}`}>{bill.name}</Link></TableCell>
                                        {/* TODO: this is incorrect */}
                                        <TableCell><Chip color={bill.privateNumber ? 'secondary' : 'primary'} label={bill.privateNumber ? 'פרטית' : 'ממשלתית'} /></TableCell>
                                        <TableCell>{bill.knsLastUpdatedDate ? new Date(bill.knsLastUpdatedDate).toLocaleString('he', {}) : '-'}</TableCell>
                                    </TableRow>)
                            }
                        </TableBody>
                    </Table>

                </Box>

            </CardContent>
            <CardActions>
                <Pagination sx={{ margin: 'auto' }} count={10} showFirstButton showLastButton />
            </CardActions>
        </Card>
    )
}

export default BillTable;