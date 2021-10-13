// main applications where to render all the componenets
import React, { Component } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";

// create class for component
class App extends Component {
  // calls load web3 before rendering
  async UNSAFE_componentWillMount() {
    // calling load web3
    await this.loadWeb3();
    // loading blochain Data
    await this.loadBlockchainData();
  }

  // web3 detect metamask when loading page
  async loadWeb3() {
    // if we detect metamask
    if (window.ethereum) {
      // create new instance for web3
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      // if we find web3 then we go with the provider
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected, example: MetaMast");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();

    // set state to display the account number in navbar
    this.setState({ account: account[0] });

    // setup network id and hook it up to our contract
    const networkId = await web3.eth.net.getId();

    // load in tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      // get the abi and address of the contract andsend it to tether variable using web3
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether });

      // get balance of the account
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
      console.log({ balance: tetherBalance });
    } else {
      window.alert("Error !! No Detected network");
    }
  }

  constructor(props) {
    super(props);
    // innitializing state
    this.state = {
      account: "0x0",
      // getting contracts from abis
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="text-center">
          <h1>Hello, World</h1>
        </div>
      </div>
    );
  }
}

export default App;