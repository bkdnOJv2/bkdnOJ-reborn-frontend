import React from 'react';
import { Link } from 'react-router-dom';
import { VscError } from 'react-icons/vsc';

import { SpinLoader } from 'components';
import ContestContext from 'context/ContestContext';

export default class ContestBanner extends React.Component {
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
      this.setState({ label: "Contest Finished" })
      clearInterval(this.timer);
      return;
    }

    let s = t % 60;
    let m = Math.floor(t/60);
    let h = Math.floor(m/60);
    m = m % 60;
    let label = (h<10 ? '0' : '') + h + ':' + (m<10 ? '0':'') + m + ':' + (s<10 ? '0':'') + s + '';
    label = `Time remaining: ${label}`
    this.setState({ label })
  }

  componentDidMount() { this.componentDidUpdate() }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.contest !== this.state.contest ) {
      const { contest } = this.props;
      this.setState({ contest })

      let start_time = new Date(contest.start_time);
      let end_time = new Date(contest.end_time);
      if (!contest.end_time) {
        var hms = this.time_limit;
        var a = hms.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        end_time = (start_time.getTime() + seconds*1000);
      }

      this.setState({ time_left : Math.floor((end_time - new Date()) / 1000) }, ()=>{
        clearInterval(this.timer)

        this.timer = setInterval(() => {
          let t = this.state.time_left;
          this.setState({ time_left: t-1 }, () => this.updateTimeLeftLabel() );
        }, 1000)
      })

    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { contest } = this.state;
    let headerComp = <>Loading</>
    if (contest) {
      if (contest.allow_spectate)
        headerComp = <>You are Spectating</>
      else
      if (contest.is_registered)
        headerComp = <>You are Participating</>
      else
        headerComp = <>You are Viewing</>
    }

    return (
      <div className="wrapper-vanilla" id="contest-banner">
        <h4 id="header"> {headerComp} </h4>

        <div className="flex-center-col">
          {
            contest ? <>
              <h4 className="m-2" id="contest-name">
                {`${contest.name}`}
              </h4>
              <sup className="pb-1">
                {`Contest Type: ${contest.format_name}`}
              </sup>
              <hr className="divisor"/>
              <span id="contest-time">
                {`${this.state.label}`}
              </span>
            </> : <>
              <SpinLoader margin="20px"/>
            </>
          }
        </div>
      </div>
    )
  }
}
