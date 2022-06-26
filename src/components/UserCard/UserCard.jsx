import React from 'react';
import PropTypes from 'prop-types';

import { FaUniversity } from 'react-icons/fa';
import defaultOrgImg from 'assets/images/default-org.png';

import './UserCard.scss';

export default class UserCard extends React.Component {
  render() {
    const {user, displayMode} = this.props;
    const {organization} = user;

    const orgImg = (organization.logo_url || defaultOrgImg)
    const orgName = (organization.short_name || organization.slug);
    const userImg = (user.avatar);

    let realname = "";
    [user.first_name, user.last_name].forEach((st) => {
      if (!st) return;
      if (realname) realname += " ";
      realname += st;
    })

    return (
      <div className="flex-center participant-container" style={{justifyContent: "center"}}>
        <div className="avatar-container">
          {
            displayMode === 'user'
            ? <img className="avatar-img" src={user.avatar} alt="User Icon"></img>
            : <img className="avatar-img" src={orgImg} alt="Org Icon"></img>
          }
        </div>
        <div className="flex-center-col user-container">
          <div className="acc-username text-truncate"
            data-toggle="tooltip" data-placement="right" title={`${user.rank} ${user.username}`}>
            <p className={`${user.rank_class} username`}>{user.username}</p>
          </div>
          {realname.length > 0 &&
            <div className="text-left acc-realname text-truncate">
              {realname}
            </div>
          }
          {!(displayMode === 'user') && organization &&
            <div className="text-left acc-org text-truncate"
              data-toggle="tooltip" data-placement="right" title={`${organization.name}`}>
              <FaUniversity/> {orgName}
            </div>
          }
        </div>
      </div>
    )
  }
}

UserCard.propTypes = {
  user: PropTypes.exact({
    username: PropTypes.string,

    rank: PropTypes.string,
    rank_class: PropTypes.string,
    rating: PropTypes.number,

    avatar: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,

    organization: PropTypes.object,
  }).isRequired,
};
