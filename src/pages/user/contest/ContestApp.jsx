import React from 'react';
import { connect } from 'react-redux';

import ReactPaginate from 'react-paginate';
import { Link, Navigate, Outlet } from 'react-router-dom';

import { ListSidebar, OneColumn } from 'layout';

import { SpinLoader, ErrorBox,
  ContestSidebar,
} from 'components';


import contestAPI from 'api/contest';
import { setTitle } from 'helpers/setTitle';
import 'styles/ClassicPagination.scss';

// Context
import ContestContext, { ContestProvider } from 'context/ContestContext';

/*

  [ Nav ---------------------------------------- ]
  
  [ Prob | Sub | Standing ] [    Contest ABC     ]
    ---------------------   [       ----         ]
  [                       ] [   Time 00:15:09    ]
  [                       ] 
  [         BODY          ] [                    ]
  [                       ] [  Other component   ]
  [                       ] [                    ]

*/

class ContestApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded : false,
      redirectUrl: null,
    }
  }

  componentDidMount() {
  }

  render() {
    const contest = this.props.contest; 
    return (
      <ListSidebar 
        mainContent={ 
          <OneColumn mainContent={[
            <div className="d-inline-flex">
              <Link to='problem'>Problems</Link>
              <Link to='submission'>Status</Link>
              <Link to='standing'>Standing</Link>
            </div>,
            <ContestProvider value={ {contest} }>
              <Outlet/>
            </ContestProvider >
          ]}/>
        }
        sideComponents={[<ContestSidebar />]}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    contest: state.contest.contest,
  }
}

export default connect(mapStateToProps, null)(ContestApp);