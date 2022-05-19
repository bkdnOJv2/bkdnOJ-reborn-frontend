import React from 'react';
import { Link, Outlet } from 'react-router-dom';

class AdminApp extends React.Component {
    render() {
        return (
            <>
                <h3>Admin Page</h3>
                <nav>
                    <Link to="problem/vuontao">Problem Vuon Tao</Link>
                    <Link to="problem/hello">Problem Hello</Link>
                </nav>

                <Outlet/>
            </>
        )
    }
}

export default AdminApp;