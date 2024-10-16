import React from 'react';
import * as chatStyles from '../assets/css/chat.css';
import { AccordionSummary, Avatar, Chip, Divider } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { CampaignTwoTone, ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: 0,
}));


const UserIcon = ({data}) => {
    if (!data) {
        return <></>;
    }
    if (data.role === "FP") {
        return <Avatar sx={{ bgcolor: "rgb(14, 170, 0)", fontSize:"1rem", fontWeight:"bold", width:"50px", height:"50px" }} >현장</Avatar>
    }
    else if (data.role === "HP") {
        return <Avatar sx={{ bgcolor: "rgb(74, 122, 230)", fontSize:"1rem", fontWeight:"bold", width:"50px", height:"50px" }} >본사</Avatar>
    }
    else if (data.role === "ADMIN") {
        if (data.id === 688) {
            return <Avatar sx={{bgcolor:"rgb(192 191 249)", fontSize:"1.3rem", fontWeight:"bold"}} >봇</Avatar>
        }
        return <Avatar sx={{ bgcolor: "orange", fontSize:"1.3rem", fontWeight:"bold", width:"50px", height:"50px" }} >관리</Avatar>
    }
    else if (data.role === "BOT"){
        return <Avatar sx={{bgcolor:"rgb(192 191 249)", fontSize:"1.3rem", fontWeight:"bold"}} >봇</Avatar>
    }
    else {
        return <CampaignTwoTone sx={{bgcolor:"rgb(64,64,64)", width:"50px", height:"50px", borderRadius:"50%", color:"white"}}/>
    }
}



export default function UserList({ UserListIcon, handleChattingClick, fpUser, hpUser, adminUser, botUser, noticeUser, me }) {


    return (
        <div className={chatStyles.userlist}>
            <div className={chatStyles.user_profile}>
                <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1.3rem", fontWeight:"500"}}>
                    <UserIcon data = {me}/>
                    {`${me.userName}`}
                </div>
                <div>
                    <Chip label={me.deptCode} variant='outlined' />
                </div>
                
            </div>
            <Divider variant='middle'/>
            <div>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1-content'
                        id='notice-userlist'
                        sx={{fontSize:"0.8rem", color:"grey"}}
                    >
                        공지사항
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={chatStyles.user_lists} onDoubleClick={() => handleChattingClick(noticeUser)}>
                            <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1rem", fontWeight:"500"}}>
                                <UserListIcon data = {noticeUser}/>
                                {`${noticeUser.userName}`}
                            </div>
                            <div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Divider variant='middle' />
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1-content'
                        id='notice-userlist'
                        sx={{fontSize:"0.8rem", color:"grey"}}
                    >
                        챗봇
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={chatStyles.user_lists} onDoubleClick={() => handleChattingClick(botUser)}>
                            <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1rem", fontWeight:"500"}}>
                                <UserListIcon data = {botUser}/>
                                {`${botUser.userName}`}
                            </div>
                            <div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Divider variant='middle' />
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1-content'
                        id='fp-userlist'
                        sx={{fontSize:"0.8rem", color:"grey"}}
                    >
                        현장 담당자
                    </AccordionSummary>
                    <AccordionDetails>
                        {fpUser.map(data => (
                            <div className={chatStyles.user_lists} key={data.id} onDoubleClick={() => handleChattingClick(data)}>
                                <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1rem", fontWeight:"500"}}>
                                    <UserListIcon data = {data}/>
                                    {`${data.userName}`}
                                </div>
                                <div>
                                    <Chip label={data.deptCode} variant='outlined' />
                                </div>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Divider variant='middle'/>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1-content'
                        id='hp-userlist'
                        sx={{fontSize:"0.8rem", color:"grey"}}
                    >
                        본사 담당자
                    </AccordionSummary>
                    <AccordionDetails>
                    {hpUser.map(data => (
                        <div className={chatStyles.user_lists} key={data.id} onDoubleClick={() => handleChattingClick(data)}>
                            <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1rem", fontWeight:"500"}}>
                                <UserListIcon data = {data}/>
                                {`${data.userName}`}
                            </div>
                            <div>
                                <Chip label={data.deptCode} variant='outlined' />
                            </div>
                        </div>
                    ))}
                    </AccordionDetails>
                </Accordion>
                <Divider variant='middle'/>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1-content'
                        id='fp-userlist'
                        sx={{fontSize:"0.8rem", color:"grey"}}
                    >
                        시스템 관리자
                    </AccordionSummary>
                    <AccordionDetails>
                    {adminUser.map(data => (
                        <div className={chatStyles.user_lists} key={data.id} onDoubleClick={() => handleChattingClick(data)}>
                            <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"1rem", fontSize:"1rem", fontWeight:"500"}}>
                                <UserListIcon data = {data}/>
                                {`${data.userName}`}
                            </div>
                            <div>
                                <Chip label={data.deptCode} variant='outlined' />
                            </div>
                        </div>
                    ))}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}

