/* eslint-disable no-unused-vars */
import React from "react";
import Select from 'react-select';

// Redux
import {connect} from "react-redux";
// import {
//   setContestParams,
//   clearContestParams,
//   setPublicParams,
//   clearPublicParams,
// } from "redux/SubFilter/actions";

import {Button, Row, Col} from "react-bootstrap";
// Helpers

// Assets
import {FaTimes, FaFilter} from "react-icons/fa";
import "./ProblemFilterSidebar.scss";

const DATA = [
  {
    value: 1,
    label: "dp",
  },
  {
    value: 2,
    label: "math",
  },
  {
    value: 3,
    label: "geometry",
  },
]

const ProblemFilterSidebar = (props) => {
  return (
      <div className="wrapper-vanilla" id="sub-filter">
        <h4>Problem Filter</h4>
        {(
          <>
            <div className="flex-center-col text-left filter-panel">
              <Row> Tags: </Row>
              <Row>
                  <Select isMulti closeMenuOnSelect={false} options={DATA}/>
              </Row>
              <div className="w-100 checkbox-panel" style={{columnGap: "5px"}}>
                {(
                  <label
                    id="only-me-lbl"
                    className="d-flex align-items-center m-0"
                  >
                    <input
                      type="checkbox"
                      id="only-me"
                      className="ml-1 mr-1"
                      checked={false}
                    ></input>
                    <span style={{flex: 2}}>Mine</span>
                  </label>
                )}
              </div>
            </div>

            <div className="p-1 text-right d-flex flex-row-reverse" style={{ columnGap: "5px", }}>
              <Button size="sm" variant="light" className="btn-svg">
                <FaTimes /> Clear
              </Button>
              <Button size="sm" variant="secondary" className="btn-svg">
                <FaFilter /> Filter
              </Button>
            </div>
          </>
        )}
      </div>
  )
}

export default ProblemFilterSidebar;
