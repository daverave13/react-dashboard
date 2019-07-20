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
            stepDateArr: [],
            sleepDateArr: [],
            sleepArr: [],
            stepArr: []
        }
    }

    componentDidMount() {
        var fitbitAccessToken;

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22DFML&redirect_uri=https%3A%2F%2Fwww.dslusser.com%2Fdashboard&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight');
        } else {
            var fragmentQueryParameters = {};
            window.location.hash.slice(1).replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) {
                fragmentQueryParameters[$1] = $3;
                }
            );
            fitbitAccessToken = fragmentQueryParameters.access_token;
        }

        let self = this;

        let url = 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1m.json';
        let bearer = 'Bearer ' + fitbitAccessToken;
        let response = fetch(url, {
            method: 'GET',
            'Access-Control-Allow-Credentials': true,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
            })
            .then(response => response.json())
            .then(json => {
            let stepLog = json['activities-steps'];
            let values = []; 
            let dates = [];
            for (let i = 30; i >= 24; i--) {
                values.push(stepLog[i].value);
                dates.push(stepLog[i].dateTime);
            }
            self.setState({
                isLoaded: true,
                stepArr: values,
                stepDateArr: dates
            });
        });
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate = startDate.toISOString().split('T')[0];
        let endDate = new Date();
        endDate = endDate.toISOString().split('T')[0];
        url = `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`;
        response = fetch(url, {
            method: 'GET',
            'Access-Control-Allow-Credentials': true,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
            })
            .then(response => response.json())
            .then(json => {
                let sleepLog = json['sleep'];
                const simpleSleepLog = sleepLog.map(x => [ x.minutesAsleep, x.dateOfSleep]);
                
                let sleepArr = [];
                for (let i = 1; i <= 7; i++) {
                    let today = new Date();
                    today.setDate(today.getDate() - i)
                    sleepArr.push([0, today.toISOString().split('T')[0]]);
                }

                for (let x of sleepArr) {
                    for (let y of simpleSleepLog) {
                        if (x[1] === y[1]) {
                            x[0] = (y[0]/60).toFixed(1);
                        }
                    }
                }
                let sleepDateArr = sleepArr.map(x => x[1]);
                sleepArr = sleepArr.map(x => x[0]);

                self.setState({
                    isLoaded: true,
                    sleepArr: sleepArr,
                    sleepDateArr: sleepDateArr
                });
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
                            labels = {this.state.stepDateArr.reverse()}
                            data = {this.state.stepArr.reverse()}
                            />
                    </div>

                    <div style={{height: 400, width: 400}}>
                        <h1>Hours Slept</h1>
                        <Barchart 
                            labels = {this.state.sleepDateArr.reverse()}
                            data = {this.state.sleepArr.reverse()}
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
