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
        var fitbitAccessToken;

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22DFML&redirect_uri=https%3A%2F%2Fwww.dslusser.com%2FEIT.html&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight');
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

        async function fetchValues() {
            var url = 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1m.json';
            var bearer = 'Bearer ' + fitbitAccessToken;
            const response = fetch(url, {
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
            });
        }

        fetchValues();

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
