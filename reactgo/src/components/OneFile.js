import React, { Component, Fragment } from 'react'

export default class OneFile extends Component {

    state = { file: {}, isLoaded: false, error: null };

    componentDidMount() {
        fetch("http://localhost:4000/v1/file/" + this.props.match.params.id)
      //.then((response) => response.json())
      .then((response)=>{
        console.log("Statis code is", response.status);
        if (response.status !== "200"){
          let err = Error;
          err.message = "Invalid response code: " + response.status;
          this.setState({error: err});
        } 

        return response.json();
      })
      .then((json) => {
        this.setState({
          file: json.file,
          isLoaded: true,
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
        );
      });
    }

    render() {
        const {file, isLoaded, error} = this.state;
        if (file.types) {
            file.types = Object.values(file.types);
        }else{
            file.types = [];
        }

        if (error){
            return <div>Error: {error.message}</div>
          }else if (!isLoaded) {
            return <p>Загрузка...</p>;
          } else {
        return (
            
            <Fragment>
                <h2>Файл: {file.title} {this.state.file.id}</h2>

                <div className='float-start'>
                    <small>Description: {file.description}</small>
                </div>
                <div className='float-end'>
                    {file.types.map((m, index) =>(
                        <span className='badge bg-secondary me-1' key={index}>
                            {m}
                        </span>
                    ))}
                </div>
                <div className='clearfix'>
                </div>
                <hr />
                
                <table className="table table-compact table-striped">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Title:</strong>
                                </td>
                            <td>{file.title}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Description</strong>
                            </td>
                            <td>{file.description}</td>
                        </tr>
                       
                    </tbody>
                </table>
            </Fragment>
        );
          }
    }
}