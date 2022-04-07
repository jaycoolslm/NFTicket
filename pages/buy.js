import React, { useState } from 'react'
import createAccount from '../hashgraph/createAccount';
import checkBalance from '../hashgraph/checkBalance';
import { mintNft, queryTokenSupply } from '../hashgraph/createNft';
import getTokenInfo from '../hashgraph/getTokenInfo';

import { create } from 'ipfs-http-client'

import Link from 'next/link';



const Buy = () => {

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


    // Get inputted token id to mint
    const [getTokenId, setTokenId] = useState('')
    const [getTokenObj, setTokenObj] = useState({})

    // stringify NFT Mint details prior to ipfs upload
    const [getMintObj, setMintObj] = useState({})

    return (
        <div className='top-container'>
            <nav>
                <ul>
                    <li><Link href='/'>Create Event</Link></li>
                    <li>Buy ticket</li>
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

                {/* ADD RELEVANT METADATA TO IPFS */}


                <h3>Mint your NFT</h3>
                <p>You must mint the NFT for the event you want to go to!</p>

                <div>
                    <input type='text' placeholder='Token ID' onChange={(e) => setTokenId(e.target.value)} />
                    <button onClick={async () => {
                        const tokenObjInfo = await getTokenInfo(getTokenId)
                        setTokenObj(tokenObjInfo)

                        setMintObj({
                            date: '01/05/2022',
                            eventId: getTokenId,
                            number: Number(tokenObjInfo.totalSupply)
                        })

                        var tokenInfo = document.getElementById('token-info')
                        tokenInfo.style.display = 'block'
                    }}>Get info</button>
                </div>

                <div id='token-info'>
                    <button onClick={() => {
                        const tokenName = getTokenObj.name
                        var eventName = document.getElementById('event-name')
                        eventName.innerHTML = `The name is ${tokenName}`
                    }}>Event name</button>
                    <p id='event-name'></p>
                </div>

                <button onClick={async () => {
                    const json = JSON.stringify(getMintObj)

                    if (json) {
                        try {
                            const ipfs = create('http://127.0.0.1:5001/api/v0')
                            console.log(json)
                            const { cid } = await ipfs.add(json)
                            console.log(String(cid))
                            mintNft(getTokenId, cid, getInputId, getInputKey)
                        } catch (e) {
                            console.error(e)
                        }
                    } else {
                        alert("No object submitted. Please try again.");
                    }
                }}>Mint</button>
            </div>
        </div>
    )
}

export default Buy