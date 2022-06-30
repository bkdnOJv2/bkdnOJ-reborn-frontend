import React from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

import {
  AiOutlinePlusCircle, AiOutlineArrowRight,
  AiOutlineForm,
} from 'react-icons/ai';

import { SpinLoader, ErrorBox } from 'components';
import Filter from './Filter';
import orgAPI from 'api/organization';

import { setTitle } from 'helpers/setTitle';
import { getYearMonthDate, getHourMinuteSecond } from 'helpers/dateFormatter';

import './List.scss'
import 'styles/ClassicPagination.scss';

const CLASSNAME = 'Organization';

export const INITIAL_FILTER = {
  'search': "",
  'ordering': "-creation_date",
};

class ListItem extends React.Component {
  formatDateTime(date) {
    const d = new Date(date);
    return (
      <div className="flex-center-col">
        <div style={{fontSize: "10px"}}>
          {getYearMonthDate(d)}
        </div>
        <div style={{fontSize: "12px"}}>
          {getHourMinuteSecond(d)}
        </div>
      </div>
    )
  }

  render() {
    const { slug, short_name, name, logo_url } = this.props;
    // const { rowidx, selectChk, onSelectChkChange } = this.props;

    return (
      <div className="org-item">
        {/* <td className="text-truncate" >
          {this.formatDateTime(end_time)}
        </td> */}
        {/* <input type="checkbox" value={selectChk}
          onChange={() => onSelectChkChange()}/> */}
      </div>
    )
  }
}

class OrgList extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {orgs, prefix} = this.props;
    if (orgs.length === 0) return <></>

    return (
      <div className="org-item-wrapper text-left m-2 ml-2 border">
        {
          orgs.map((org, idx) => (
            <div className="org-item pt-1 pb-1" key={`org-${org.slug}`}>
              <div className="text-left ml-1">
                <p className="m-0">
                  <strong>{`${prefix}${idx+1}. ${org.slug}`}</strong>:
                </p>
                <div className="d-flex ml-2">
                  {
                    org.logo_url ?
                      <img style={{height: "50px", width: "auto"}} src={org.logo_url}/>
                    : <div style={{maxHeight: "50px", minHeight: "50px", maxWidth: "50px", minWidth: "50px"}}
                        className="text-center border" >No Img</div>
                  }
                  <p className="m-0 ml-2">
                      <strong>Name</strong>: {org.name}
                      <br></br>
                      <strong>Short Name</strong>: {org.short_name}
                      <br></br>
                      <Link to={`/admin/org/${org.slug}`}>{`>> Detail`}</Link>
                      <Link className="pl-3" to="#">{`+ Add Sub Org`}</Link>
                  </p>
                </div>
              </div>
              <OrgList orgs={org.sub_orgs} prefix={prefix+`${idx+1}.`}/>
            </div>
          ))
        }
      </div>
    )
  }
}

class OrgListWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {...INITIAL_FILTER},

      submitting: false,
      loaded: false,
      errors: null,

      redirectUrl: null,
    }
    setTitle('Admin | Orgs')
  }

  callApi() {
    this.setState({loaded: false, errors: null})

    orgAPI.getMyOrgs()
      .then((res) => {
        this.setState({
          memberOf: res.data.member_of,
          adminOf: res.data.admin_of,
          loaded: true,
        })
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loaded: true,
          errors: ["Cannot fetch orgs. Please retry again."],
        })
      })
  }

  componentDidMount() {
    this.callApi()
  }

  render() {
    if (this.state.redirectUrl)
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )

    const { adminOf, memberOf, loaded, errors, submitting } = this.state;

    return (
      <div className="admin admin-org">
        {/* Options for Admins: Create New,.... */}
        <div className="admin-options wrapper-vanilla m-0 mb-1">
          <div className="border d-inline-flex p-1" >
            <Button size="sm" style={{minHeight: "30px"}}
              variant="dark" className="btn-svg" disabled={submitting}
              onClick={(e) => this.setState({ redirectUrl: 'new' })}
            >
              <AiOutlinePlusCircle /> Add Root Org (Form)
              {/* <span className="d-none d-md-inline-flex">Add Root Org (Form)</span>
              <span className="d-inline-flex d-md-none">
                <AiOutlineArrowRight />
                <AiOutlineForm />
              </span> */}
            </Button>
          </div>

          <div className="flex-center">
            <div className="admin-note text-center">
              {
                submitting && <span className="loading_3dot">Đang xử lý yêu cầu</span>
              }
            </div>
          </div>
        </div>

        {
          loaded && !errors && <div className="admin-table org-table wrapper-vanilla">
            <h4>Your Organizations</h4>
            <ErrorBox errors={errors} />
            {
              <OrgList orgs={adminOf} prefix={""}/>
            }
          </div>
        }
      </div>
    )
  }
}

export default OrgListWrapper;
