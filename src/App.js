import React, { Component } from 'react';

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        selectValue : 'Orange',
        languages: [],
        langData: [],
        inputTextData: [],
        translatedText: '',
        greetings: " "
      }
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    getLanguages = () =>{ //Gets the languages from the api
        fetch("https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=trnsl.1.1.20190221T204509Z.c06afcc7d72c0976.a15b798d25dd008eb2d3e67c6aeec9c377ff6f89", {
          method: "GET"
        })
        .then(resp => resp.json())
        .then(jsonData => {
          this.setState({
            languages: jsonData.langs
          });
        })    
        .catch(error =>{
          console.log("Fetching and parsing error ", error)
        });
    }
    
    componentWillMount = () => {
        this.getLanguages();
    }

    handleGreetingsInput = (event) => { //set input greetings data
        this.setState({
            greetings: event.target.value
        });
    }

    handleInputChange(event){ //set Input data
        this.formatLanguages();
        this.setState({
            inputTextData: event.target.value.split('\n')
        })
    }

    handleDDChange = (e) =>{ //set Dropdown value
        this.setState({
            selectValue: e.target.value
        })
    }

    handleSubmit = (e) =>{
        console.log(e.target.value);
        this.translate();
    }

    translate = () =>{ //send text to be translated and fetch translated text
        let textToTranslate = this.state.greetings+" "+ this.state.inputTextData.join(' ');
        let selectedLang = this.state.selectValue;
        fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?&key=trnsl.1.1.20190221T204509Z.c06afcc7d72c0976.a15b798d25dd008eb2d3e67c6aeec9c377ff6f89&text=${textToTranslate}&lang=${selectedLang}&format=plain`)
        .then(response => response.json())
        .then(jData => {
            this.setState({
                translatedText: jData.text
            })
        })
        .catch(error => console.log("Errors during translation fetching/parsing: ", error));
    }

    formatLanguages = () =>{ //Formatting the data to the required input
        let tempArr = Object.entries(this.state.languages);
        let tempArr2 = [];
        tempArr.forEach(function(e){
            tempArr2.push({
            id: e[0],
            title: e[1],
            });
        });
        this.setState({
            langData: tempArr2
        });
    }
    
    
    render(){
        const styleForm = {
            margin: 40,
            padding: 20,
            display: 'inline-block'
          }
        const styleInput = {
            height: 100
        }
        const styleButton = {
            margin: 20,
            padding: 10
        }
        const styleDropdown = {
            padding: 10
        }

        return(
            <form style = {styleForm}>
                <label><h2>Enter Greetings:</h2></label>
                <input type='text' id = "greetingsInput" onChange = {this.handleGreetingsInput} />
                <label><h2>Enter names:</h2></label>
                <textarea name = 'inputNames' id = 'textAreaInput' onChange = {this.handleInputChange} style = {styleInput}/>
                <div>
                    <select style = {styleDropdown} value={this.state.selectValue} onChange={this.handleDDChange}>
                        <option defaultValue = "Choose Language">Choose language here</option>                    
                        {this.state.langData.map(item => <option value ={item.id} key={item.id}>{item.title}</option>)}
                    </select>
                    <input type = "button" style = {styleButton} onClick = {this.handleSubmit} value = 'Submit' />
                </div>
                <h1>{this.state.translatedText}</h1>
                <p><a href ="http://translate.yandex.com/" >Powered by Yandex.Translate</a></p>
            </form>
        )
    }
}

export default App;