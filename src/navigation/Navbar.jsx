import {Link, useNavigate} from "react-router-dom";

import {useEffect} from "react";
import {config} from '../config.js'
import logo from '../assets/logo.png'
import {Auth} from "aws-amplify";

export default function Navbar() {

    const navigate = useNavigate()

    useEffect(() => {

    }, []);

    return (
        <div className={'navbar'}>

            <div className={'nav-row-container is-gap-1'}>
                <img src={logo} height={'30px'} onClick={() => navigate('/')}/>
                {/*<p className={'monospace'} style={{fontWeight: '700'}}>{config.initials}</p>*/}
            </div>

            <div className={'nav-row-container is-gap-2 monospace'}>

            </div>

        </div>
    )
}