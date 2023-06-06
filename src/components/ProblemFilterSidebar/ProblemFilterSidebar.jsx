/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import problemTagAPI from "api/problem-tag";

// Assets
import {FaTimes, FaFilter} from "react-icons/fa";
import "./ProblemFilterSidebar.scss";
import { toast } from "react-toastify";

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
  const [isLoading, setLoading] = useState(true)
  const [tags, setTags] = useState([])

  const tag2Option = (tag) => {
    return {value: tag.id, label: tag.name}
  }

  useEffect(() => {
    async function fetch() {
      try {
        const response = await problemTagAPI.getProblemTags()
        setTags(response.data.results);
        setLoading(false);
      } catch (error) {
        toast.error("Couldn't retrieve problem tags", {toastId: "problem-filter-sidebar-tags"})
        console.log(error)
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <div className="wrapper-vanilla" id="sub-filter">
      <h4>Problem Filter</h4>
      {(
        <>
          <div className="flex-center-col text-left filter-panel p-2">
            <Row>
              Problem Tags:
            </Row>
            <Row>
              <div className="unset-css-select-menu">
                <Select isMulti isLoading={isLoading} 
                  closeMenuOnSelect={false} options={tags.map((tag) => tag2Option(tag))} 
                  placeholder="Select.." />
              </div>
            </Row>
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
