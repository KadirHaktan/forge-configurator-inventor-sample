/// <reference path="bom.js" />
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
import './parametersContainer.css';
import Parameter from './parameter';
import { getActiveProject, getParameters, getUpdateParameters, modalProgressShowing, updateFailedShowing, errorData } from '../reducers/mainReducer';
import { fetchParameters, resetParameters, updateModelWithParameters } from '../actions/parametersActions';
import { showModalProgress, showUpdateFailed, invalidateDrawing } from '../actions/uiFlagsActions';
import Button from '@hig/button';
import Tooltip from '@hig/tooltip';
import { Alert24 } from "@hig/icons";

import ModalProgress from './modalProgress';
import ModalFail from './modalFail';
import { fullWarningMsg } from '../utils/conversion';


export class ParametersContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            containerWidth: '296px',
            isOpen: true
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
       
    }

    handleMouseEnter() {
        this.setState({
            containerWidth: '296px',
            isOpen:true
        })
    }

    handleMouseLeave() {
        this.setState({
            containerWidth: '296px',
            isOpen:false
        })
    }

    updateContainerWidth() {
        const screenWidth = window.innerWidth;
        const newContainerWidth = screenWidth < 1440 ? '100%' : '296px';

        if (this.state.containerWidth !== newContainerWidth) {
            this.setState({
                containerWidth: newContainerWidth,
            });
        }
    }

    componentDidMount() {
        this.props.fetchParameters(this.props.activeProject.id);
        this.updateContainerWidth();
        window.addEventListener('resize', this.updateContainerWidth.bind(this));
    }

    componentDidUpdate(prevProps) {
        // fetch parameters when params UI was active before projects initialized
        if (this.props.activeProject.id !== prevProps.activeProject.id)
            this.props.fetchParameters(this.props.activeProject.id);

       
    }

    //componentWillUnmount() {
    //    window.removeEventListener('resize', this.updateContainerWidth.bind(this));
    //}


    updateClicked() {
        this.props.updateModelWithParameters(this.props.activeProject.id, this.props.projectUpdateParameters);
        // mark drawing as not valid if any available
        this.props.invalidateDrawing();
    }

    onUpdateFailedCloseClick() {
        this.props.showUpdateFailed(false);
    }

    onModalProgressClose() {
        this.props.hideModalProgress();
    }


    getFilteredParameter(label){
        return label === "PulloutHandle_Included" || label === "CornerWheels_Included" || label === "LabelDish_Included" || label === "LidStyle" || label === "ColourAndFinish"?label:""
    }

    renderSubParameterList(parameterList){
       
            const subParameterList=parameterList.filter(parameter=>this.getFilteredParameter(parameter.label))
            console.log(subParameterList)
            return subParameterList.map((parameter, index) =>
                <Parameter parameter={parameter} key={index }/>
                
            )
        
    }


    

    render() {
        const parameterList = this.props.activeProject ? this.props.projectUpdateParameters : [];
        const buttonsContainerClass = parameterList ? "buttonsContainer" : "buttonsContainer hidden";

        // if model adopted with warning - then button should became white and have a tooltip with warning details
        const adoptWarning = this.props.adoptWarning;
        const tooltipProps = adoptWarning ? { openOnHover: true, content: () => <div className="warningButtonTooltip">{ adoptWarning }</div>  } : { open: false };
        const buttonProps = adoptWarning ? { type: "secondary", icon: <Alert24 style={{ color: "orange" }} /> } : { type: "primary" };
        
       

        return (
            <>
                {
                    !this.state.isOpen && (
                        <button className="btn btn-primary  btn-sm configurator-button" onMouseEnter={this.handleMouseEnter} onTouchStart={this.handleMouseEnter}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    )
                }
                
                {
                    this.state.isOpen && (
                        <div style={{ position: 'relative', width: this.state.containerWidth }} className="parametersContainer" onMouseLeave={this.handleMouseLeave} onTouchEnd={this.handleMouseLeave}>
                            <div className="pencilContainer" style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                margin: '5px'
                            }}>
                            </div>
                            <div className="parameters" id="parameterList">
                                {

                                    parameterList ? this.renderSubParameterList(parameterList) : "No parameters"
                                }
                            </div>



                            <hr className="parametersSeparator" />
                            <div className={buttonsContainerClass}>
                                <Button style={{ width: '125px' }}
                                    size="standard"
                                    title="Reset"
                                    type="secondary"
                                    width="grow"
                                    onClick={() => { this.props.resetParameters(this.props.activeProject.id, this.props.projectSourceParameters); }}
                                />
                                <div style={{ width: '14px' }} />
                                <div width="grow" /*this div makes the size of the Button below not to be broken by the encapsulating Tooltip*/>
                                    <Tooltip {...tooltipProps} className="paramTooltip" anchorPoint="top-center">
                                        <Button id="updateButton"
                                            style={{ width: '125px' }}
                                            {...buttonProps}
                                            size="standard"
                                            title="Update"
                                            width="grow"
                                            onClick={() => this.updateClicked()} />
                                    </Tooltip>
                                </div>

                                {this.props.modalProgressShowing ?
                                    (<ModalProgress
                                        open={this.props.modalProgressShowing}
                                        title="Updating Model"
                                        doneTitle="Update Finished"
                                        label={this.props.activeProject.id}
                                        icon="/Assembly_icon.svg"
                                        onClose={() => this.onModalProgressClose()}
                                        warningMsg={this.props.adoptWarning}
                                    />) : (<></>)
                                }
                                {this.props.updateFailedShowing &&
                                    <ModalFail
                                        open={this.props.updateFailedShowing}
                                        title="Update Failed"
                                        contentName="Project:"
                                        label={this.props.activeProject.id}
                                        onClose={() => this.onUpdateFailedCloseClick()}
                                        errorData={this.props.errorData} />
                                }
                            </div>
                        </div>
                    )
                }
              
            
            </>
           
        );
    }
}

/* istanbul ignore next */
export default connect(function (store) {
    const activeProject = getActiveProject(store);
    const adoptWarning = fullWarningMsg(activeProject.adoptWarnings);

    return {
        activeProject: activeProject,
        modalProgressShowing: modalProgressShowing(store),
        updateFailedShowing: updateFailedShowing(store),
        errorData: errorData(store),
        projectSourceParameters: getParameters(activeProject.id, store),
        projectUpdateParameters: getUpdateParameters(activeProject.id, store),
        adoptWarning: adoptWarning
    };
}, { fetchParameters, resetParameters, updateModelWithParameters, showModalProgress, showUpdateFailed, invalidateDrawing,
    hideModalProgress: () => async (dispatch) => { dispatch(showModalProgress(false)); } })(ParametersContainer);
