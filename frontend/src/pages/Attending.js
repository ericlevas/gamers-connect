import React, {Component} from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/spinner/Spinner';


class AttendingPage extends Component{
    state={
        isLoading: false,
        attendingEvents: []
    };

    isActive  = true;

    static contextType = AuthContext;


    componentDidMount() {
        this.fetchAttendingEvents();
    }

    fetchAttendingEvents=()=>{
        const requestBody = {
            query: `
                    query{
                        attendings{
                            _id
                            createdAt
                            event{
                                _id
                                title
                                gameTitle
                                date
                            }
                        }
                    }
                `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');

                }
                return res.json();
            })
            .then(resData => {
                const attendingEvents = resData.data.attendings;
                if(this.isActive){
                    this.setState({ attendingEvents: attendingEvents,isLoading:false});
                }
            })
            .catch(err => {
                console.log(err);
                if(this.isActive){
                    this.setState({isLoading:false}); 
                }
            });
    }

    componentWillUnmount(){
        this.isActive=false;
    }

    render(){
        return(
        <React.Fragment>
        {this.state.isLoading ? <Spinner/> : 
            (<ul>
                {this.state.attendingEvents.map(attending => (
                    <li key = {attending._id}>{attending.event.title} - 
                    {new Date(attending.createdAt).toLocaleDateString('en-US')}
                </li>))}
            </ul>)}
        </React.Fragment>
        );
    }
}

export default AttendingPage;