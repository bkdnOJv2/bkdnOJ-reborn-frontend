import React from 'react';
import {Button, Dropdown} from "react-bootstrap";

import './ContestStanding.scss';
import 'styles/Ratings.scss';
import "./StandingFilter.scss";
import {FaFilter} from "react-icons/fa";

const StandingFilter = ({orgList, onSave, onToggle, isFilterEnable}) => {
  const [selectedOrg, setSelectedOrg] = React.useState([]);

  const onSelectChange = (e) => {
    let selectedIds = [];
    const options = e.target.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setSelectedOrg(selectedIds);
  }

  const onFilterToggle = (e) => onToggle(e.target.checked)

  const onSaveClick = () => onSave(selectedOrg)

  const onClearClick = () => {
    onSave([]);
    onToggle(false);
    setSelectedOrg([]);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle variant={isFilterEnable ? "primary" : "secondary"} id="dropdown-basic" className="btn-svg">
        <FaFilter size={18}/> Filter
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div id="standing-filter">
          <div className="filter-col org-filter">
            <div className="filter-label">
              <label>
                <input
                  type="checkbox"
                  id="org-filter-checkbox"
                  onChange={onFilterToggle}
                  checked={isFilterEnable}
                />
                <span>Organization</span>
              </label>
            </div>
            <select multiple name="orgs-filter" className="filter-container border rounded" onChange={onSelectChange}>
              {orgList?.map(org => {
                  return <option key={`opt-org-${org.slug}`} value={org.slug}
                                 selected={selectedOrg.includes(org.slug)}
                                 className="filter-option">
                    {`(${org.slug}) ${org.name}`}
                  </option>;
                }
              )}
            </select>
          </div>

          <div className="filter-control-btn">
            <Button size="sm" onClick={onSaveClick}>Save</Button>
            <Button variant="warning" size="sm" onClick={onClearClick}>Clear</Button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
};

export default StandingFilter;
