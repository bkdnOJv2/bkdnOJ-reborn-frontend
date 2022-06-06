import React from 'react';
import { Link } from 'react-router-dom';

import { SpinLoader } from 'components';
import ContestContext from 'context/ContestContext';

export default class ContestBanner extends React.Component {
  static contextType = ContestContext;

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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contest !== this.context.contest ) {
      const { contest } = this.context;
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

    return (
      <div className="wrapper-vanilla" id="contest-banner">
        <h4 id="header">Contest</h4>
        <div className="flex-center-col">
          {
            contest ? <>
              <h4 className="m-2" id="contest-name">
                {`${this.state.contest.name}`}
              </h4>
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
