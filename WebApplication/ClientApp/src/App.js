/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Design Automation team for Inventor
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Surface from '@hig/surface';
import './app.css';
import TabsContainer from './components/tabsContainer';
import { showAdoptWithParamsFailed, fetchShowParametersChanged } from './actions/uiFlagsActions';
import { detectToken } from './actions/profileActions';
import ModalProgress from './components/modalProgress';
import { adoptWithParamsFailed, embeddedModeEnabled, embeddedModeUrl, adoptWithParamsProgressShowing, errorData } from './reducers/mainReducer';
import { adoptProjectWithParameters } from './actions/adoptWithParamsActions';

import { fetchProjects, updateActiveProject } from './actions/projectListActions'
import { fetchParameters } from './actions/parametersActions';


export class App extends Component {
  constructor(props) {
    super(props);
    props.detectToken();
  }
  componentDidMount() {
    if (!this.props.embeddedModeEnabled)
      this.props.fetchShowParametersChanged();

    if (this.props.embeddedModeUrl != null)
          this.props.adoptProjectWithParameters(this.props.embeddedModeUrl);

      this.props.fetchProjects();

      
  }

  render () {
      return (
          <Surface className={`fullheight ${!this.props.projectList.projects ? 'center-animation' : ''}`} id="main" level={200}>
              {
                  this.props.projectList.projects ? (  
                    <>
               <TabsContainer/>
         {this.props.adoptWithParamsProgressShowing &&
          <ModalProgress
              open={true}
              title="Loading Content"
              label=" "
              icon="/Assembly_icon.svg"/>}
                      </>) : (<div className="loaderBar"></div> )
          }
          </Surface>
      //  <Surface className="fullheight" id="main" level={200}>
      //  <TabsContainer/>
      //  {this.props.adoptWithParamsProgressShowing &&
      //    <ModalProgress
      //        open={true}
      //        title="Loading Content"
      //        label=" "
      //        icon="/Assembly_icon.svg"/>
      //  }
      //</Surface>
    );
  }
}

/* istanbul ignore next */
export default connect(function (store) {
    return {
    projectList: store.projectList,
    adoptWithParamsProgressShowing: adoptWithParamsProgressShowing(store),
    adoptWithParamsFailed: adoptWithParamsFailed(store),
    embeddedModeEnabled: embeddedModeEnabled(store),
    embeddedModeUrl: embeddedModeUrl(store),
    errorData: errorData(store)
  };}, {
    showAdoptWithParamsFailed, adoptProjectWithParameters, fetchShowParametersChanged, detectToken, fetchProjects, fetchParameters, updateActiveProject
})(App);

