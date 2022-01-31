import React, { useEffect, useState } from 'react';
import { 
    TextField,
    Button,
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import dayjs from 'dayjs';

type FRections = {
    name: string,
    users: string[],
    count: number
}

type IRections = {
    name: string,
    users: string[],
    count: number
}

type IMessage = {
    key: string,
    datetime: dayjs.Dayjs,
    message: string,
    user: string,
    reactions: IRections[],
}

type FMessage = {
    ts: string,
    text: string,
    username: string,
    user: string,
    reactions: FRections[],
}

const useStyles = makeStyles({
    feild: {
        paddingTop: '10px',
        paddingBottom: '10px'
    },
});

function Chatops(): JSX.Element {

  const endpoint = '<YOUR API ENDPOINT>';

  const classes = useStyles();
  const [message, setMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [updatedAt, setUpatedAt] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    axios.post(endpoint, {
        message: message
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
  };

  const getMessages = () => {
    axios.get(endpoint)
    .then(res => {
        console.log(res.data.messages);
        const datas = res.data.messages as FMessage[];
        const tmpList: IMessage[] = []
        datas.forEach((data) => {
            tmpList.push({
                key: data.ts,
                datetime: dayjs.unix(Number(data.ts.split('.')[0])),
                message: data.text,
                user: data.username ? data.username : data.user,
                reactions: data.reactions ? data.reactions : []
            });
        });
        setMessageList(tmpList);
        console.log(tmpList);
    }).catch(err => {
        console.log(err);
    });
  };

  useEffect(() => {
    getMessages();
    setUpatedAt(dayjs().format('YYYY-MM-DD HH:mm:ss'));

    setInterval(() => {
        getMessages();
        setUpatedAt(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 10000);
  }, []);

  return (
    <>
        <Container maxWidth="lg">
            <h1>Chatops Samples</h1>
            <div>
                <h2>Send Message to Slack</h2>
                <div className={classes.feild}>
                    <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        onChange={handleInputChange}
                    />
                </div>
                <Button
                    variant="outlined"
                    onClick={sendMessage}
                >
                    Send Message
                </Button>
            </div>
            <div>
                <h2>Get Message from Slack</h2>
                <span>updated at: {updatedAt}</span>
                <div className={classes.feild}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>DateTime</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>user</TableCell>
                                <TableCell>reactions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {messageList.map((row) => (
                                <TableRow key={row.key}>
                                    <TableCell>{row.datetime.format("YYYY/MM/DD HH:mm:ss")}</TableCell>
                                    <TableCell>{row.message}</TableCell>
                                    <TableCell>{row.user}</TableCell>
                                    <TableCell>{row.reactions.map((reaction) => {
                                        return (
                                            <div>
                                                <span>{reaction.name}</span>
                                                <span>{' , '}</span>
                                                <span>{reaction.users.join(',')}</span>
                                                <span>{' , '}</span>
                                                <span>{reaction.count}</span>
                                            </div>
                                        );
                                    })}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Container>
    </>
  );
}

export default Chatops;
