import {Link} from 'react-router-dom';

export function qmClarify(msg) {
  return <Link to="#" onClick={()=>alert(msg)}>?</Link>
}
