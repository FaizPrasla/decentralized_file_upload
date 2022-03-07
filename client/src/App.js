import FileUpload from './contracts/FileUpload.json'
import React, { Component } from "react";
import { useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Content from "./content";
import Navbar from './Navbar';
import { FileUploader } from "react-drag-drop-files";
import 'bootstrap/dist/css/bootstrap.min.css';
import { create } from 'ipfs-http-client'





import "./App.css";
// import { Navbar } from 'react-bootstrap';

const ipfsClient = require('ipfs-http-client');
const ipfs = create({ host: 'ipfs.infura.io', port: 80, apiPath: '/ipfs/api/v0' })

class App extends Component {
  
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("account: ", accounts);
      this.setState({account: accounts[0]});
      // setting network 
      const networkId = await web3.eth.net.getId();
      console.log("networkID: ", networkId);
      const networkData = FileUpload.networks[networkId];
      if(networkData) {
        const upload = new web3.eth.Contract(FileUpload.abi, networkData.address);
        this.setState({upload});
        const numFiles = await upload.methods.numFiles().call();
        for(var i = numFiles; i > 0; i--){
          const file = await upload.methods.files(i).call();
          this.setState({files: [...this.state.files, file]})
        }
      }
 
      // // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // // Set web3, accounts, and contract to the state, and then proceed with an
      // // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadFile = description => {
    console.log("Submitting file to IPFS...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return
      }
      this.setState({ loading: true })
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }
      //uint _size, string memory _name, string memory _ext, string memory _description, string memory _hash
      this.state.dstorage.methods.upload(result[0].size, this.state.name, this.state.type, description, result[0].hash).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })
    })
  }



  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  constructor(props) {
    super(props)
      this.state = {
        account: '',
        upload: null,
        files: [],
        loading: false,
        type: null,
        name: null
      }
      this.uploadFile = this.uploadFile.bind(this)
      this.captureFile = this.captureFile.bind(this)
  }

  

  render() {


    return (
      

      <div className="App">
         <Navbar account={this.state.account} />

         {/* <Main /> */}
         <Content files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile} />
      </div>
    );
  }
}

export default App;
