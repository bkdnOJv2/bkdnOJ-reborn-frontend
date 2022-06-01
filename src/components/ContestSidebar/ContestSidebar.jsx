import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import profileClient from 'api/profile';
import { log } from 'helpers/logger';


class ContestSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '...',
      time_left: null,
      contest: null,
    }
  }

  updateTimeLeftLabel() {
    const t = this.state.time_left;
    if (t === null) return;
    if (t <= 0) {
      this.setState({ label: "Finished" })
      clearInterval(this.timer);
      return;
    }

    let s = t % 60;
    let m = Math.floor(t/60);
    let h = Math.floor(m/60);
    m = m % 60;
    let label = (h<10 ? '0' : '') + h + ':' + (m<10 ? '0':'') + m + ':' + (s<10 ? '0':'') + s + ' left';
    this.setState({ label })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile !== this.props.profile) {
      if (this.props.profile.profile && this.props.profile.profile.current_contest && this.props.profile.profile.current_contest.contest)  {
        this.setState({ contest: this.props.profile.profile.current_contest.contest }, () => {
          const contest = this.state.contest;

          let start_time = new Date(contest.start_time);
          let end_time = new Date(contest.end_time);
          if (!contest.end_time) {
            var hms = this.time_limit;
            var a = hms.split(':'); 
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
            end_time = (start_time.getTime() + seconds*1000);
          }

          this.setState({ time_left : Math.floor((end_time - new Date()) / 1000) });

          clearInterval(this.timer)
          this.timer = setInterval(() => {
            let t = this.state.time_left;
            if (typeof(t) === 'number')
              this.setState({ time_left: t-1 }, () => this.updateTimeLeftLabel() );
          }, 1000)
        })
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const contest = this.state.contest;
    if (!contest)
      return (
        <>
          <h5 style={{fontSize: "16px"}}>
            <span>{`Practice`}</span>
          </h5>
          <div>
            <span>{`Currently not in any contest.`}</span>
          </div>
        </>
      )

    return (
      <>
        <h5 style={{paddingBottom: "unset", fontSize: "16px"}}>
          <span><Link to={`/contest/${contest.key}`}>Currently participating</Link></span>
        </h5>
        <h5 >
          <span><Link to={`/contest/${contest.key}`}>{contest.name}</Link></span>
        </h5>
        <div>
          <span>{`Time remaining: `}{this.state.label}</span>
        </div>
      </>
    )
  }
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.user.profile,
  }
}

export default connect(mapStateToProps, null)(ContestSidebar);