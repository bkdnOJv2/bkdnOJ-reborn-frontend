import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

import { SpinLoader, ErrorBox } from 'components';
import submissionApi from 'api/submission';
import contestApi from 'api/contest';
import { setTitle } from 'helpers/setTitle';

// Contexts
import ContestContext from 'context/ContestContext';

class ContestStanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standing: [],
      loaded: false,
      errors: null,
    }
  }

  render() {

  }
}
