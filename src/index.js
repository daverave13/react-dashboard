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
                dateArr: dates
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
                let values = [];
                let dates = [];
                let sleepLog = json['sleep'];

                console.table(sleepLog);
                
   
                for (let i = 0; i <= 7; i++) {
                    let currentDay = new Date();
                    currentDay.setDate(currentDay.getDate() - i);
                    currentDay = currentDay.toISOString().split('T')[0];
                    console.log(i);
                    console.table(values);
                    console.table(dates);
                    
                    let sleepDay = sleepLog[i]['dateOfSleep'];

                    if (sleepDay === currentDay) {
                        values.push(sleepLog[i]['minutesAsleep']);
                        dates.push(sleepDay);
                    } else {
                        values.push(0);
                        dates.push(currentDay);
                        // i--;
                    }
                }
                console.table(values);
                console.table(dates);                
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
