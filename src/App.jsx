
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Navbar from './navigation/Navbar.jsx';
import Home from './screens/Home.jsx';
import ManageOrgsScreen from "./screens/ManageOrgsScreen.jsx";
import EditOrgScreen from "./screens/EditOrgScreen.jsx";

function App() {

    return (
        <div className={'master-container'} style={{overflow: 'hidden'}}>

                <div className={`static-container`}>
                    <Navbar/>

                    <div className={'page-content'}>
                        <div className={'mainframe'}>
                            <Routes>
                                <Route path={'/'} element={<Home/>}/>
                                <Route path={'/manage/organizations'} element={<ManageOrgsScreen/>}/>
                                <Route path={'/manage/organizations/edit'} element={<EditOrgScreen/>}/>
                            </Routes>
                        </div>
                    </div>

                </div>

        </div>
    );
}

export default App;
