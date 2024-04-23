import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default class OneType extends Component{
    state = {
        files: [],
        isLoaded: false,
        error: null,
        typeName: "",
    }

    componentDidMount() {
        fetch("http://localhost:4000/v1/files/" + this.props.match.params.id)
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
              files: json.files,
              isLoaded: true,
              typeName: this.props.location.typeName,
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
        let { files, isLoaded, error, typeName } = this.state;

        if (!files){
            files = [];
        }

        if (error){
          return <div>Error: {error.message}</div>
        }else if (!isLoaded) {
          return <p>Загрузка...</p>;
        } else {
          return (
            <Fragment>
              <h2>Тип файла: {typeName}</h2>
    
              <div className='list-group'>
                {files.map((m) => (
                    <Link to={`/files/${m.id}`} className="list-group-item list-group-item-action">{m.title}</Link>
                ))}
              </div>
            </Fragment>
          );
        }
      }
}
