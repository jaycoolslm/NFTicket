import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { motion } from 'framer-motion'
import Icon from '../components/LandingText'

const Home = () => {

    // Animation 3x reasons why 
    const container = {
        hidden: { x: '50%', opacity: 0 },
        show: {
            x: 0,
            opacity: 1,
            transition: {
                staggerChildren: 1,
            }
        }
    }

    const item = {
        hidden: { x: '50%', opacity: 0 },
        show: { x: 0, opacity: 1, transition: { duration: 0.75 } }
    }




    return (
        <>
            <section className='landing'>
                <nav>
                    <ul>
                        <Link href='/'>
                            <a className='unactive'>Create</a>
                        </Link>
                        <Link href='#'>
                            <a className="active">Home</a>
                        </Link>
                        <Link href='/buy'>
                            <a className='unactive'>Buy</a>
                        </Link>
                    </ul>
                </nav>

                <div className='grid-container'>
                    <div id='landing-text' className='grid-item flex-center'>
                        <Icon />
                    </div>


                    <motion.div
                        variants={container}
                        initial='hidden'
                        animate='show'
                        className='grid-item flex'
                    >

                        <motion.div className='flex-item' variants={item}>
                            <div id='royalty'></div>
                            <h3>Earn royalties any time tickets get resold.</h3>
                        </motion.div>


                        <motion.div className='flex-item' variants={item}>
                            <div id='safe'></div>
                            <h3>Impossible to be scammed while purchasing.</h3>
                        </motion.div>

                        <motion.div className='flex-item' variants={item}>

                            <div id='de'></div>
                            <h3>Decentralised hashgraph technology</h3>
                        </motion.div>
                    </motion.div>

                </div>
            </section>
        </>
    )
}


export default Home