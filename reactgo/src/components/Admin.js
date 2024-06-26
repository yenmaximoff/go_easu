import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";

export default class Admin extends Component{
    state = {
        files: [],
        isLoaded: false,
        error: null
      };
    
      componentDidMount() {
        fetch("http://localhost:4000/v1/files")
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
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error,
              });
            }
            );
          });
      }
    
      render() {
        const { files, isLoaded, error } = this.state;
        if (error){
          return <div>Error: {error.message}</div>
        }else if (!isLoaded) {
          return <p>Загрузка...</p>;
        } else {
          return (
            <Fragment>
              <h2>Управление данными</h2>
    
              <div className="list-group">
                {files.map((m) => (
                  
                    <Link key={m.id} className="list-group-item list-group-item-action" to={`/admin/file/${m.id}`}>{m.title}</Link>
                 
                ))}
              </div>
            </Fragment>
          );
        }
      }
}