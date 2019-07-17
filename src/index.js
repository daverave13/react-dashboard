import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Barchart from './Barchart';
import './App.css';

class App extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            dateArr: [],
            stepArr: []
        }
    }

    componentDidMount() {
        //API to fitbit will go here in production
        this.setState({
            isLoaded: true,
            stepArr: ["8494", "14007", "12567", "3516", "0", "0", "0"],
            dateArr: ["2019-07-16", "2019-07-15", "2019-07-14", "2019-07-13", "2019-07-12", "2019-07-11", "2019-07-10"]
        });
    }

    render() {
        return (
            <div>
                <h1 className="centerText">Dashboard</h1>

                <div className="componentContainer">
                    <div style={{height: 400, width: 400}}>
                        <h1>Fitbit Steps</h1>
                        <Barchart className="sans"
                            labels = {this.state.dateArr.reverse()}
                            data = {this.state.stepArr.reverse()}
                            />
                    </div>

                    <div style={{height: 400, width: 400}}>
                        <h1>Hours Slept</h1>
                        <Barchart 
                            labels = {this.state.dateArr}
                            data = {[6,8,7,5,7,3,9]}
                            />
                    </div>
                </div>
            </div>
        )
    }
};

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
