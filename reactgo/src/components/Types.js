import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default class Types extends Component{
    state = {
        types: [],
        isLoaded: false,
        error: null,
    }

    componentDidMount() {
        fetch("http://localhost:4000/v1/types")
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
              types: json.types,
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

    render(){
        const {types, isLoaded, error} = this.state;
        if (error){
            return <div>Error: {error.message}</div>
          }else if (!isLoaded) {
            return <p>Загрузка...</p>;
          } else {
        return (
            <Fragment>
                <h2>Types</h2>

                <div className='list-group'>
                    {types.map((m) => (
                            <Link 
                            key={m.id}
                            className="list-group-item list-group-item-action"
                             to={{
                                pathname: `/type/${m.id}`,
                                typeName: m.type_name,
                        }}
                        >
                            {m.type_name}</Link>
                    
                    ))}
                </div>
            </Fragment>
        );
                    }
    }
}