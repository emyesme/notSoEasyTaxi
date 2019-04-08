import React, {Component}  from 'react';
import {Modal,Button,Form } from 'react-bootstrap';
import CreateModel from './createModel';
import ReadModel from './readModel';
import UpdateModel from './updateModel';
import DeleteModel from './deleteModel';


const backdropStyle = {
    backgroundColor: 'rgb(93, 110, 128)',
};

const api = "http://localhost:4000";

class crud extends Component {
    constructor(props) {
        super(props);
        
    }
    


    render() {

        return (
            <div style={backdropStyle}>
                <div>
                    <Card style={grayRgb}> 
                        <ReadModel/>
                    </Card>
                </div>
                <div>
                    <Card style={grayRgb}> 
                        <CreateModel/>
                    </Card>
                </div>
                <div>
                    <Card style={grayRgb}> 
                        <UpdateModel/>
                    </Card>
                </div>
                <div>
                    <Card style={grayRgb}> 
                        <DeleteModel/>
                    </Card>
                </div>
                
            </div>
            );
    }
}
 
export default crud;