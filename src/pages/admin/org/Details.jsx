import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Form, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { FaGlobe, FaRegTrashAlt, FaChartLine } from 'react-icons/fa';

import { SpinLoader, ErrorBox } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import UserMultiSelect from 'components/SelectMulti/User';

import orgAPI from 'api/organization';

import './Details.scss';

class OrgDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.params.slug,
      data: null,
      loaded: false, errors: null,
    }
  }

  callApi() {
    this.setState({ loaded: false, errors: null })
    orgAPI.getOrg({slug: this.state.slug})
      .then((res) => {
        this.setState({
          loaded: true, data: res.data,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true, errors: (err.response.data || ["Cannot get org info."]),
        })
      })
  }

  componentDidMount() {
    this.callApi()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params !== this.props.params) {
      this.setState({
        slug: this.props.params.slug,
      }, () => this.callApi());
    }
  }


  inputChangeHandler(event, params={isCheckbox: null}) {
    const isCheckbox = params.isCheckbox || false;

    let newData = this.state.data;
    if (!isCheckbox) newData[event.target.id] = event.target.value
    else {
      newData[event.target.id] = !newData[event.target.id]
    }
    this.setState({ data : newData })
  }

  render() {
    if (this.state.redirectUrl)
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )

    const { data, loaded, errors } = this.state;

    return (
      <div className="admin org-panel wrapper-vanilla">
        <h4 className="org-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span><SpinLoader/> Cannot Load </span>}
          { loaded && !errors && <div className="panel-header">
              <span className="title-text text-truncate">{`Org | ${this.state.slug}`}</span>

              <span>
                <Button className="btn-svg" size="sm" variant="dark"
                  onClick={()=>this.setState({ redirectUrl: `/contest/${this.key}` })}>
                    <FaGlobe size={16}/><span className="d-none d-md-inline">View on Site</span>
                </Button>
              </span>

              <span>
                <Button className="btn-svg" size="sm" variant="danger"
                  onClick={()=>this.deleteObjectHandler()}>
                    <FaRegTrashAlt size={16}/><span className="d-none d-md-inline">Delete</span>
                </Button>
              </span>
            </div>
          }
        </h4>
        <hr/>
        <div className="org-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }
          { loaded && <>
            <ErrorBox errors={errors}/>
              { !errors && <>
                <Form id="org-general" onSubmit={(e) => this.formSubmitHandler(e)}>
                  <Row>
                    <Form.Label column="sm" md={2}> Slug </Form.Label>
                    <Col > <Form.Control size="sm" type="text" placeholder="Slug" id="slug"
                            value={data.slug || ''} disabled readOnly
                    /></Col>

                    <Form.Label column="sm" md={2} > Shortname </Form.Label>
                    <Col > <Form.Control size="sm" type="text" placeholder="Short org name" id="short_name"
                            value={data.short_name || ''} onChange={(e)=>this.inputChangeHandler(e)}
                    /></Col>
                  </Row>

                  <Row>
                    <Form.Label column="sm" md={2} > Name </Form.Label>
                    <Col md={10}> <Form.Control size="sm" type="text" placeholder="Org name" id="name"
                            value={data.name || ''} onChange={(e)=>this.inputChangeHandler(e)}
                    /></Col>
                  </Row>

                  <Row>
                    <Col sm={2}>
                      <div style={{maxHeight: "100px", maxWidth: "100px", height: "100px", width: "100px"}} >
                        {
                          data.logo_url ? <img src={data.logo_url} style={{height: "100%"}}/>
                          : <p style={{height: "100%"}} className="border text-center m-0">No Image</p>
                        }
                      </div>
                    </Col>
                    <Col>
                      <Row className="w-100">
                        <Form.Label column="sm" > Org Logo Url </Form.Label>
                        <Form.Control size="sm" type="text" id="logo_url"
                              value={data.logo_url || ''}
                              onChange={(e)=>this.inputChangeHandler(e)}/>
                      </Row>
                    </Col>
                  </Row>
                <Row>
                  <Form.Label column="sm" sm={3} className="required"> Admins </Form.Label>
                  <Col>
                    <UserMultiSelect id="admins"
                      value={data.admins || []} onChange={(arr)=>this.setState({ data: { ...data, admins: arr } })}
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={6}> Member count: </Form.Label>
                  <Col xs={6}>
                    <Form.Control size="sm" type="text" placeholder="Member Count" id="member_count"
                          value={isNaN(data.member_count) ? '' : data.member_count} disabled readOnly
                    />
                  </Col>

                  <Form.Label column="sm" xs={6} > Sub org count: </Form.Label>
                  <Col xs={6}> <Form.Control size="sm" type="text" placeholder="Sub Org Count" id="suborg_count"
                          value={isNaN(data.suborg_count) ? '' : data.suborg_count} disabled readOnly
                  /></Col>
                </Row>
                <Row>
                  <Form.Label column="sm" xl={12} > Parent Org </Form.Label>
                  <Col xl={12}> {
                    data.parent_org ? <>
                      {data.parent_org.logo_url ? <img src={data.parent_org.logo_url} style={{maxHeight: "100px", maxWidth: "100px"}} />
                      : <span className="border">No Image</span>}
                      <ul>
                        <li><strong>Slug</strong>: <Link to={`/admin/org/${data.parent_org.slug}`}>{data.parent_org.slug}</Link></li>
                        <li><strong>Shortname</strong>: {data.parent_org.short_name}</li>
                        <li><strong>Name</strong>: {data.parent_org.name}</li>
                      </ul>
                    </>
                    : <span className="w-100 text-center">No Parent Org</span>
                  } </Col>
                </Row>

                <hr className="m-2" />

                <Row>
                  <Col lg={10}>
                  </Col>
                  <Col >
                    <Button variant="dark" size="sm" type="submit" className="">
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </> }
          </> }
        </div>
      </div>
    )
  }
};

let wrapped = OrgDetail;
wrapped = withParams(wrapped);
export default wrapped;
