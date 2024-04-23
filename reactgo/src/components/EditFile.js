

import React, { Component, Fragment } from 'react';
import './EditFile.css';
import Input from './form-components/Input';
import TextArea from './form-components/TextArea';
import Alert from './ui-components/Alert';
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';


export default class EditFile extends Component{
    constructor(props){
        super(props);
        this.state = {
            file: {
                id: 0,
                title: "",
                description: "",
                upload: "",
            },
            isLoaded: false,
            error: null,
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            },
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
       
        evt.preventDefault();

        //проверка на стороне клиента
        let errors = [];
        if (this.state.file.title === ""){
            errors.push("title");
        }

        this.setState({errors: errors});

        if (errors.length > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.props.jwt);
        console.log(payload);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        fetch('http://localhost:4000/v1/admin/editfile', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
               this.setState({
                alert: {type: "alert-danger", message: data.error.message},
               });
            }else{
                this.setState({
                    alert: {type: "alert-success", message: "Изменения сохранены!"},
                });
            }
        });
    };

    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState)=>({
           file:{
            ...prevState.file,
            [name]: value,
           } 
        }))

    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount(){
       if (this.props.jwt === ""){
        this.props.history.push({
            pathname: "/login",
        })
        return
       }
       const id = this.props.match.params.id;
       if (id > 0){
        fetch("http://localhost:4000/v1/file/" + id)
        .then((response) => {
            if (response.status !== "200"){
                let err = Error;
                err.Message = "Invalid response code: " + response.status;
                this.setState({error: err});
            }
            return response.json();
        })
        .then((json) => {
            this.setState(
                {
                  file: {
                    id: id,
                    title: json.file.title,
                    description: json.file.description,
                  },
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
       }else{
        this.setState({isLoaded: true});
       }
    }

    confirmDelete = (e) => {
        confirmAlert({
            title: 'Delete Movie?',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                  fetch("http://localhost:4000/v1/admin/deletefile/" + this.state.file.id, {method: "GET"})
                    .then(response => response.json)
                    .then(data => {
                      if (data.error) {
                          this.setState({
                            alert: {type: "alert-danger", message: data.error.message}
                          })
                      } else {
                        this.props.history.push({
                          pathname: "/admin",
                        })
      
                      }
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
      
    }

    render(){
       let {file, isLoaded, error} = this.state;
       
       if (error){
            return <div>Error: {error.Message}</div>
       }else if (!isLoaded){
            return <p>Загрузка...</p>
       }else{
       return(
        <Fragment>
            <h2>Добавление/Изменение данных</h2>
            <Alert 
                alertType={this.state.alert.type}
                alertMessage={this.state.alert.message}
                />
            <hr />
            
            <form onSubmit={this.handleSubmit}>
                <input
                type='hidden'
                name='id'
                id='id'
                value={file.id}
                onChange={this.handleChange}
                />         

       <Input
       title={"Название"}
       className={this.hasError("title") ? "is-invalid" : ""}
       type={'text'}
       name={'title'}
       value={file.title}
       handleChange={this.handleChange}
       errorDiv = {this.hasError("title") ? "text-danger" : "d-none"}
       errorMsg = {"Пожалуйста, введите название файла"}
       />


    <TextArea 
    title={"Комментарий"}
    name={"description"}
    value={file.description}
    rows={"3"}
    handleChange={this.handleChange}
    />



                        <div className='mb-3'>
                            <label htmlFor="uploadedFile" className='form-label'>
                                Загрузить файл
                            </label>
                            <input
                                type="file"
                                className='form-control'
                                id="uploadedFile"
                                name="uploadedFile"
                                onChange={this.handleChange}
                                value={file.upload}
                            />
</div> 

                <hr />

                <button className='btn btn-primary'>Сохранить</button>
                <Link to="/admin" className="btn btn-warning ms-1">
                    Отмена
                </Link>

                {file.id > 0 && (
                    <a href="#!" onClick={() => this.confirmDelete()}
                    className='btn btn-danger ms-1'>
                        Удалить
                    </a>
                )}
            </form>

           
        </Fragment>
       );
    }
}
} 