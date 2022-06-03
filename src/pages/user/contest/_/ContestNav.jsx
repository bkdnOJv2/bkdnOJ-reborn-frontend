import React from 'react';
import { Link } from 'react-router-dom';

import { addClass, removeClass } from 'helpers/dom_functions';

const ContestAppNavHeaders = ['problem', 'submission', 'standing'];
class ContestNav extends React.Component {
  setActive(clsname) {
    ContestAppNavHeaders.forEach((header) => {
      const comp = document.getElementById(`contest-nav-${header}`)
      if (header === clsname) addClass(comp, 'active')
      else removeClass(comp, 'active')
    })
  }

  render() {
    return (
      <>
      <div className="wrapper-vanilla">
        <div className="d-inline-flex text-left" id="contest-app-nav">
          {
            ContestAppNavHeaders.map(
              (st, i) =>
              <Link key={`contest-nav-${i}`} id={`contest-nav-${st}`}
                onClick={()=>this.setActive(st)}
                to={`${st}`}>{st}</Link>
            )
          }
        </div>
      </div>
      </>
    )
  }
}
export default ContestNav;
