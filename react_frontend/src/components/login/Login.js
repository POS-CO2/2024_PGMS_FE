import React, { useState } from 'react';
import * as loginStyles from '../../assets/css/login.css'
import Box from "@mui/material/Box"
import {TextField} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import {FilledInput, IconButton, FormControl, OutlinedInput} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import kuromi from '../../assets/images/kuromi.jpg';


export default function Login({handleLogin}) {
    const [showPassword, setShowPassword] = useState(false);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [text, setText] = useState('');

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const activeButton = () => {
        console.log("enter");
    } 

    const activeEnter = (e) => {
        if(e.key === "Enter") {
            onsubmit();
        }
    }

    return (
            <div className={loginStyles.loginBox}>
                <img className={loginStyles.login_img} src={kuromi} />
                <div className={loginStyles.inlineContainer}>
                    <div className={loginStyles.logo}>
                        <span>PGMS</span>
                        <br></br>
                        <span>온실가스관리시스템</span>
                    </div>
                    <div className={loginStyles.inlineContainer}>
                    <Box sx={{display: 'flex', alignItems: 'flex-end', width: "235px"}} autoComplete="on">
                            <TextField id='outlined-basic' value={id} onChange={(e) => setId(e.target.value)} label='ID' variant='outlined' InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    </InputAdornment>
                                )
                            }}>
                            </TextField>
                        </Box>
                    </div>
                    <div className={loginStyles.inlineContainer}>
                    <FormControl sx={{ width: "235px" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        startAdornment={
                            <InputAdornment position='start'>
                                <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5}} />
                            </InputAdornment>
                        }
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin(id, password);
                            }
                        }}
                    />
                    </FormControl>
                    </div>
                    <Button onClick={async () => {await handleLogin(id,password); } } style={{backgroundColor: "#000046", color: "white", width: "235px"}}>로그인</Button>
                </div>
                    
            </div>
    );
}