import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Files from './components/Files';
import Admin from './components/Admin';
import Home from './components/Home';
import Types from './components/Types';

import OneFile from './components/OneFile';
import OneType from './components/OneType';
import EditFile from './components/EditFile';
import Login from './components/Login';

export default class App extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      jwt: "",
    }
    this.handleJWTChange(this.handleJWTChange.bind(this));
  }

  componentDidMount(){
    let t = window.localStorage.getItem("jwt");
    if (t) {
      if (this.state.jwt === "") {
        this.setState({jwt: JSON.parse(t)});
      }
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({jwt: jwt});
  }

  logout = () => {
    this.setState({jwt: ""});
    window.localStorage.removeItem("jwt");
  }

  render(){

    let loginLink;
    if (this.state.jwt === ""){
      loginLink = <Link to="/login">
        <button type="button" class="btn btn-primary">Login</button>
        </Link>
    }else{
      loginLink = <Link to="/logout" onClick={this.logout}>
        <button type="button" class="btn btn-primary">Logout</button>
        </Link>
    }

  return (
    <Router>
    <div className="container">

      <div className="row">
        <div className='col mt-3'>
        <h1 className="mt-3">
          Электронное хранилище
        </h1>
        </div>
        <div className='col mt-3 text-end'>
          {loginLink}
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <ul className="list-group">
              <li className="list-group-item">
                <Link to="/">Главная</Link>
              </li>
              <li className="list-group-item">
                <Link to="/files">Данные</Link>
              </li>
              <li className="list-group-item">
                <Link to="/types">Категории(Типы)</Link>
              </li>

              {this.state.jwt !== "" && (
              <Fragment>
              <li className="list-group-item">
                <Link to="/admin/file/0">Добавление данных</Link>
              </li>
              <li className="list-group-item">
                <Link to="/admin">Manage</Link>
              </li>
              </Fragment>
          )}

            </ul>
            <pre>
              {JSON.stringify(this.state, null, 3)}
            </pre>
          </nav>
        </div>

        <div className="col-md-10">
          <Switch>
            
            <Route path="/files/:id" component={OneFile} />

            <Route path="/files">
              <Files />
            </Route>

            <Route path="/type/:id" component={OneType} />

            <Route exact path="/login" component={(props) => <Login {...props} handleJWTChange = {this.handleJWTChange}/>} />

            <Route exact path="/types">
              <Types />
            </Route>

            <Route path="/admin/file/:id" component={(props) => (
              <EditFile {...props} jwt={this.state.jwt} /> 
              )}
              />

            <Route
            path="/admin"
            component={(props) => (
            <Admin {...props} jwt={this.state.jwt} />
            )}
            />

            

            {/*<Route path="/admin">
              <Admin />
            </Route>*/}
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
    </Router>
  );
}
}

