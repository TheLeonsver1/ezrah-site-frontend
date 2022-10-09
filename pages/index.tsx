import { gql } from '@apollo/client'
import { NotificationAdd } from '@mui/icons-material'
import { Card, CardActions, CardContent, Chip, Divider, Grid, IconButton, List, ListItem, Pagination, PaginationItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { AppContext } from 'next/app'
import { RequestContext } from 'next/dist/server/base-server'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '../components/Header/Header'
import Layout from '../components/Layout/Layout'
import { Bill, DEFAULT_LOGGED_IN_USER_PROPS, LoggedInUser, LoggedInUserProp as LoggedInUserProps, UserPost } from '../data/types'
import styles from '../styles/Home.module.css'
import { serverQueryGraphql } from '../utils/graphQLApiUtils'
import { apiGet, EndpointEnum, restClient } from '../utils/restApiUtils'
import { MinimialPageProps } from './_app'

const Home: NextPage<HomePageProps> = (props) => {
  return (
    <Layout {...props.loggedInUser}>
      <Box marginBottom={3} component="section">
        <Typography variant='h1'>אזרח</Typography>
        <Typography variant='body1'>
          גלו על פעילות הכנסת ועקבו אחריה.
        </Typography>
        <Typography variant='body1'>
          שתפו אזרחים אחרים במה שמפריע לכם, או בפעולות שאתם מעריכים, והכווינו את פועל הממשלה וחברי הכנסת.
        </Typography>
      </Box>
      {/* <Stack marginTop={3} direction={{ xs: 'column', md: 'row' }} spacing={16}>
        <Card>
          <CardContent>
            <Box component="div">
              <Typography variant='h2'>פוסטים חדשים</Typography>

              <List>
                {
                  props.postsYouShouldSee?.map(post => <ListItem key={post.id}></ListItem>)
                }
              </List>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>

            <Box component="div">
              <Typography variant='h2'>חוקים שעודכנו לאחרונה</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>שם החוק</TableCell>
                    <TableCell>תאריך עדכון אחרון</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    props.lastUpdatedBills?.map((bill) => <TableRow key={bill.id}>
                      <TableCell><Link href={`/bills/${bill.id}`}>{bill.name}</Link></TableCell>
                      <TableCell>{bill.knsLastUpdatedDate ? new Date(bill.knsLastUpdatedDate).toLocaleString('he') : '-'}</TableCell>
                    </TableRow>)
                  }
                </TableBody>
              </Table>

            </Box>

          </CardContent>
        </Card>

      </Stack> */}
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box component="div">
                <Typography variant='h2'>דיונים חדשים</Typography>

                <List>
                  {
                    props.newestPosts?.map(post => <ListItem key={post.id}>{post.latestContentVersion}</ListItem>)
                  }
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
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

        </Grid>

      </Grid>
    </Layout >
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  let props = await serverQueryGraphql<HomePageProps>(context, {
    query: gql`
      query {
        loggedInUser{
          userId,
          isLoggedIn,
          userName
        }
        lastUpdatedBills: getBills {
          id,
          name,
          knsLastUpdatedDate,
          privateNumber
        }
        newestPosts: getPosts {
          latestContentVersion,
          postCreator {
            id,
            username
          }
        }
      }
    `
  }, {
    ...DEFAULT_LOGGED_IN_USER_PROPS,
    lastUpdatedBills: [],
    newestPosts: []
  });

  return {
    props
  }
}



type HomePageProps = LoggedInUserProps & {
  lastUpdatedBills: Bill[]
  newestPosts: UserPost[],
}