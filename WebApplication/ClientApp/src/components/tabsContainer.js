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
import ForgeView from './forgeView';
import ParametersContainer from './parametersContainer';
import './tabs.css';
import { embeddedModeEnabled, activeTabIndex } from '../reducers/mainReducer';
import { updateActiveTabIndex } from '../actions/uiFlagsActions';

export class TabsContainer extends Component {


    constructor(props) {
        super(props);
        this.state = { open: this.props.embeddedModeEnabled };
    }

    onTabChange(index) {
      this.props.updateActiveTabIndex(index);
    }

    render() {

       // const idx = this.props.activeTabIndex;
       // const showProjectsTab = this.props.embeddedModeEnabled;
        const showParameters = this.state.open

        return (
            
            <div id="model" className='tabContent fullheight'>
            
                <div className='inRow fullheight'>
                    {!showParameters &&
                        <ParametersContainer />
                    }
                    <ForgeView/>
                  </div>
                </div>
        
        );
    }
}

/* istanbul ignore next */
export default connect(function (store){
  return {
    activeTabIndex: activeTabIndex(store),
    embeddedModeEnabled: embeddedModeEnabled(store)
  };
}, { updateActiveTabIndex } )(TabsContainer);