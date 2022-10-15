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
import BillTable from '../components/BillTable/BillTable'
import { Header } from '../components/Layout/Header/Header'
import Layout from '../components/Layout/Layout'
import { Bill, DEFAULT_LOGGED_IN_USER_PROPS, LoggedInUser, LoggedInUserProp as LoggedInUserProps, UserPost } from '../data/types'
import styles from '../styles/Home.module.css'
import { serverQueryGraphql } from '../utils/graphQLApiUtils'
import { apiGet, EndpointEnum, restClient } from '../utils/restApiUtils'
import { MinimialPageProps } from './_app'

const Home: NextPage<HomePageProps> = (props) => {
  return (
    <Layout {...props.loggedInUser}>
      <Typography variant='h1'>אזרח</Typography>
      <PromoForNonLoggedInUsers />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <NewPosts {...props} />
        </Grid>
        <Grid item xs={8}>
          <BillTable {...props} />
        </Grid>
      </Grid>
    </Layout >
  )
}

export default Home

const PromoForNonLoggedInUsers: React.FC = () => {
  return (
    <Box marginBottom={3}>
      <Typography variant='body1'>
        גלו על פעילות הכנסת ועקבו אחריה.
      </Typography>
      <Typography variant='body1'>
        שתפו אזרחים אחרים במה שמפריע לכם, או בפעולות שאתם מעריכים, והכווינו את פועל הממשלה וחברי הכנסת.
      </Typography>
    </Box>
  );
}

const NewPosts: React.FC<HomePageProps> = (props) => {
  let postsOrNotFoundMessage;
  if (props.newestPosts && props.newestPosts.length > 0) {
    postsOrNotFoundMessage = (
      <List>
        {
          props.newestPosts.map(post => <ListItem key={post.id}>{post.latestContentVersion}</ListItem>)
        }
      </List>
    );
  } else {
    postsOrNotFoundMessage = (
      <List>
        <ListItem>לא נמצאו דיונים</ListItem>
      </List>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box component="div">
          <Typography variant='h2'>דיונים חדשים</Typography>
          {postsOrNotFoundMessage}
        </Box>
      </CardContent>
    </Card>
  );
}

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