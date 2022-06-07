import React from 'react';
import { Button } from 'react-bootstrap';
import {VscEyeClosed, VscEye, VscRecord} from 'react-icons/vsc';

import { addClass, removeClass } from 'helpers/dom_functions';

class ContestController extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleNav() {
    const { showNav } = this.props;
    const comp = document.getElementById('one-column-element-i-1')
    if (showNav) addClass(comp, 'd-none');
    else removeClass(comp, 'd-none');
    this.props.setShowNav(!showNav)
  }

  render() {
    const { showNav } = this.props;

    return (
      <div className="flex-center" style={{
        position: "absolute",
        right: "4px", top: "4px",
        columnGap: "2px",
        width: "unset", height: "unset",
      }}>
        <Button onClick={()=>this.toggleNav()} className="btn-svg"
          id="ct_ctrl_nav" style={btnStyle}
          size="sm" variant={!showNav ? "light" : "dark"}
        >
          {!showNav ? <VscEye/> : <VscEyeClosed/>}
          Nav
        </Button>

        {/* <Button onClick={(e)=>alert('Click')} className="btn-svg"
          id="ct-ctrl-live"
          size="sm" variant="light"
        >
          <VscRecord style={{color: "red"}}/> Live
        </Button> */}
      </div>
    )
  }
}

export default ContestController;

const btnStyle = {
  height: "30px",
};
