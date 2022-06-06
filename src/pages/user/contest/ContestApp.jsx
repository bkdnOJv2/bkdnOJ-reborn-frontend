import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { Link, Outlet } from 'react-router-dom';

import { ListSidebar, OneColumn } from 'layout';

import { SpinLoader, ErrorBox,
  ContestSidebar,
} from 'components';

import contestAPI from 'api/contest';
import { setTitle } from 'helpers/setTitle';
import { withParams, withNavigation } from 'helpers/react-router';

import 'styles/ClassicPagination.scss';
import './ContestApp.scss';

// Context Components
import {
  ContestNav, ContestBanner, ContestController,
} from './_';

// Context
import ContestContext, { ContestProvider } from 'context/ContestContext';

/*

  [ Nav ---------------------------------------- ]

  [                   Contest                    ]
  [             Time Left: 00:15:09              ]
  [ -------------------------------------------- ]
  [ Prob | Sub | Standing                        ]

  [                       ] [                    ]
  [                       ] [  Other component   ]
  [         BODY          ] [                    ]
  [                       ]
  [                       ]

*/
class ContestApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded : false,
      contest_key: this.props.params.key,
      contest: null,
      redirectUrl: null,

      showNav: true,
    }
  }

  componentDidMount() {
    console.log(this.props.params)
    contestAPI.getContest({key : this.state.contest_key})
    .then((res) => {
      this.setState({
        contest: res.data,
        loaded: true,
      })
    })
    .catch((err) => {
      toast.error(`Contest is not accessible. (${err})`)
      // this.props.navigate( -1, { replace: true } )
    })
  }

  render() {
    const { contest, loaded, showNav } = this.state;
    let mains = [
      <ContestBanner />,
      <ContestNav show={showNav}/>,
      contest ? <Outlet/>
      : <div className="shadow flex-center" style={{ "height": "100px" }}>
        <SpinLoader margin="0"/>
      </div>
    ]
    // console.log(mains)
    // if (showNav) mains.splice(1, 0, <ContestNav/>)

    return (
      <div id="contest-app">
        <ContestProvider value={ {contest} }>
          <ContestController showNav={showNav} setShowNav={(v)=>this.setState({showNav: v})}
          />
          <OneColumn mainContent={mains}/>
        </ContestProvider >
      </div>
    )
  }
}

let wrapped = withParams(ContestApp);
wrapped = withNavigation(wrapped);

const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    contest: state.contest.contest,
  }
}
export default connect(mapStateToProps, null)(wrapped);
