import React from 'react';
import { Button } from 'react-bootstrap';
import {VscEyeClosed, VscEye, VscRecord} from 'react-icons/vsc';

class ContestController extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { showNav, setShowNav } = this.props;

    return (
      <div className="flex-center" style={{
        position: "absolute",
        right: "4px", top: "4px",
        columnGap: "2px",
        width: "unset", height: "unset",
      }}>
        <Button onClick={()=>setShowNav(!showNav)} className="btn-svg"
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
