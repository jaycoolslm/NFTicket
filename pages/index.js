import React, { useState } from 'react';
import createAccount from '../hashgraph/createAccount';
import checkBalance from '../hashgraph/checkBalance';
import { createNft } from '../hashgraph/createNft';


import Link from 'next/link';


function App() {

  // Output signup or signin
  const handleSignin = () => {
    const signin = document.querySelector('.signin')
    const signup = document.querySelector('.signup')
    signin.style.display = 'block'
    signup.style.display = 'none'

    // removing this div out view 
    var variable = document.querySelector('.signin-output')
    variable.style.display = 'none'
  }

  const handleSignup = () => {
    const signup = document.querySelector('.signup')
    const signin = document.querySelector('.signin')
    signup.style.display = 'block'
    signin.style.display = 'none'
  }

  const setAccountDetails = async () => {
    const accountDetails = await createAccount()
    console.log(accountDetails)

    var authAfter = document.querySelector('.after-auth')
    authAfter.style.display = 'block'

    setInputId(String(accountDetails.newAccountId))
    setInputKey(String(accountDetails.newAccountPrivateKey))

  }

  const [getInputId, setInputId] = useState('')
  const [getInputKey, setInputKey] = useState('')
  const [getBalance, setBalance] = useState('')


  // handle NFT inputs
  const [getTokenName, setTokenName] = useState('')
  const [getTokenSymbol, setTokenSymbol] = useState('')
  const [getMaxSupply, setMaxSupply] = useState(0)

  // store token ID after createNft() called
  const [getTokenId, setTokenId] = useState('')
  const [getTokenObject, setTokenObject] = useState(undefined)


  return (
    <div className="top-container">

      <nav>
        <ul>
          <li>Create Event</li>
          <li><Link href='/buy'>Buy ticket</Link></li>
        </ul>
      </nav>

      <h1>NFT Events</h1>

      <div className='auth'>
        <h2>Authorization</h2>

        <div className='buttons'>
          <button onClick={handleSignin}>Have an account?</button>
          <button onClick={handleSignup}>Create an account</button>
        </div>

        <div className='signin'>
          <h3>Enter your details</h3>
          <form >
            <input type='text' placeholder='Account ID' onChange={(e) => setInputId(e.target.value)} />
            <input type='text' placeholder='Private Key' onChange={(e) => setInputKey(e.target.value)} />
            <button onClick={(e) => {
              e.preventDefault()
              var variable = document.querySelector('.signin-output')
              variable.style.display = 'block'

              var authAfter = document.querySelector('.after-auth')
              authAfter.style.display = 'block'
            }}>Enter</button>

            <div className='signin-output'>
              <p>Your account id is: {getInputId}</p>
              <p>Your private key is: {getInputKey}</p>
            </div>
          </form>
        </div>

        <div className='signup'>
          <h3>Generate account</h3>

          <button onClick={setAccountDetails}>
            Generate
          </button>

          <p>Your account id is: {getInputId}</p>
          <p>Your private key is: {getInputKey}</p>
        </div>
      </div>

      <br></br>

      <div className='after-auth'>
        {/* CHECK BALANCE */}
        <button onClick={async (e) => {
          e.preventDefault()
          const balance = await checkBalance(getInputId)
          setBalance(String(balance))
        }}>
          Check balance
        </button>

        <button onClick={async (e) => {
          e.preventDefault()
          const balance = await checkBalance('0.0.26562420')
          setBalance(String(balance))
        }}>
          Check operator balance
        </button>

        <p>The requested balance is {getBalance}</p>


        {/* CREATE NFTicket EVENT */}
        <h2>Want to create an event?</h2>
        <p>Use our NFT service for the ultimate ticket solution</p>
        <form>
          <div>
            <label>Ticket Name</label>
            <input type='text' onChange={(e) => setTokenName(e.target.value)} />
          </div>

          <div>
            <label>Ticket Symbol</label>
            <input type='text' onChange={(e) => setTokenSymbol(e.target.value)} />
          </div>

          <div>
            <label>Maximum Supply</label>
            <input type='number' onChange={(e) => setMaxSupply(e.target.value)} />
          </div>

        </form>
        <button onClick={async () => {
          var error = document.querySelector('.createnft-err')
          if (getTokenName !== '' && getMaxSupply !== 0) {
            error.style.display = 'none'
            const tokenId = await createNft(getTokenName, getTokenSymbol, getMaxSupply, getInputId, getInputKey)
            setTokenId(String(tokenId))
            setTokenObject(tokenId)

            var success = document.querySelector('.createnft-suc')
            success.style.display = 'block'
          } else {
            error.style.display = 'block'
          }
        }}>Create</button>

        <p className='createnft-err failure'>You have not entered in all the details</p>
        <p className='createnft-suc success'>NFT event successfully made!</p>
        <p className='token-id'>Your NFT ID is:{getTokenId}</p>
      </div>
    </div >
  );
}



export default App;