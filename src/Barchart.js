import React from 'react';
import { Bar } from 'react-chartjs-2';



class Barchart extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        }
    }   
    render() {
        let data= {
            labels: this.props.labels,
            datasets: [{
                data: this.props.data,
                backgroundColor: 'rgb(43, 124, 255)',
                borderColor: 'rgb(38, 66, 112)',
                height: 400,
                width: 400
            }]
        }

        let options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            }
        }

        return <Bar data={data} options={options}/>;
    }
}

export default Barchart;